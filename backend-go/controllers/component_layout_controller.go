package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"backend-go/database"
	"backend-go/models"
)

type ComponentLayoutController struct{}

// GetComponentLayouts handles GET /api/component-layouts
func (ctrl *ComponentLayoutController) GetComponentLayouts(c *gin.Context) {
	db := database.GetDB()
	var layouts []models.ComponentLayout

	// Build query with filters
	query := db.Model(&models.ComponentLayout{})

	// Filter by componentId
	if componentId := c.Query("componentId"); componentId != "" {
		query = query.Where("component_id = ?", componentId)
	}
	
	// Filter by breakpoint
	if breakpoint := c.Query("breakpoint"); breakpoint != "" {
		query = query.Where("breakpoint = ?", breakpoint)
	}
	
	// Legacy filter support
	if componentId := c.Query("filters[componentId][$eq]"); componentId != "" {
		query = query.Where("component_id = ?", componentId)
	}
	
	if breakpoint := c.Query("filters[breakpoint][$eq]"); breakpoint != "" {
		query = query.Where("breakpoint = ?", breakpoint)
	}

	// Execute query
	if err := query.Find(&layouts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusInternalServerError,
				"name":    "InternalServerError",
				"message": "Failed to fetch component layouts",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Convert to Strapi format
	var strapiResponse []models.StrapiComponentLayoutResponse
	for _, layout := range layouts {
		strapiResponse = append(strapiResponse, layout.ToStrapiResponse())
	}

	// Return in Strapi format
	c.JSON(http.StatusOK, gin.H{
		"data": strapiResponse,
		"meta": gin.H{
			"pagination": gin.H{
				"page":      1,
				"pageSize":  len(strapiResponse),
				"pageCount": 1,
				"total":     len(strapiResponse),
			},
		},
	})
}

// CreateComponentLayout handles POST /api/component-layouts
func (ctrl *ComponentLayoutController) CreateComponentLayout(c *gin.Context) {
	db := database.GetDB()

	var requestData struct {
		Data models.ComponentLayout `json:"data"`
	}

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusBadRequest,
				"name":    "ValidationError",
				"message": "Invalid request data",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	layout := requestData.Data

	// Validate required fields
	if layout.ComponentID == "" || layout.Breakpoint == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusBadRequest,
				"name":    "ValidationError",
				"message": "ComponentID and Breakpoint are required",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Set defaults
	if layout.Scale == 0 {
		layout.Scale = 1.0
	}
	if layout.Opacity == 0 {
		layout.Opacity = 1.0
	}
	if layout.ZIndex == 0 {
		layout.ZIndex = 1
	}

	// Create the layout
	if err := db.Create(&layout).Error; err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			c.JSON(http.StatusConflict, gin.H{
				"error": map[string]interface{}{
					"status":  http.StatusConflict,
					"name":    "ConflictError",
					"message": "Component layout already exists for this breakpoint",
					"details": map[string]interface{}{},
				},
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusInternalServerError,
				"name":    "InternalServerError",
				"message": "Failed to create component layout",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Return in Strapi format
	response := layout.ToStrapiResponse()
	c.JSON(http.StatusCreated, gin.H{
		"data": response,
		"meta": gin.H{},
	})
}

// UpdateComponentLayout handles PUT /api/component-layouts/:id
func (ctrl *ComponentLayoutController) UpdateComponentLayout(c *gin.Context) {
	db := database.GetDB()
	id := c.Param("id")

	// Convert id to uint
	layoutID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusBadRequest,
				"name":    "ValidationError",
				"message": "Invalid layout ID",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	var requestData struct {
		Data models.ComponentLayout `json:"data"`
	}

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusBadRequest,
				"name":    "ValidationError",
				"message": "Invalid request data",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Find existing layout
	var layout models.ComponentLayout
	if err := db.First(&layout, layoutID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusNotFound,
				"name":    "NotFoundError",
				"message": "Component layout not found",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Update fields
	updateData := requestData.Data
	if updateData.ComponentID != "" {
		layout.ComponentID = updateData.ComponentID
	}
	if updateData.Breakpoint != "" {
		layout.Breakpoint = updateData.Breakpoint
	}
	if updateData.X != 0 || updateData.Y != 0 {
		layout.X = updateData.X
		layout.Y = updateData.Y
	}
	if updateData.Width != 0 {
		layout.Width = updateData.Width
	}
	if updateData.Height != 0 {
		layout.Height = updateData.Height
	}
	if updateData.Scale != 0 {
		layout.Scale = updateData.Scale
	}
	if updateData.ZIndex != 0 {
		layout.ZIndex = updateData.ZIndex
	}
	if updateData.Opacity != 0 {
		layout.Opacity = updateData.Opacity
	}
	layout.Rotation = updateData.Rotation // Can be 0

	// Save changes
	if err := db.Save(&layout).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusInternalServerError,
				"name":    "InternalServerError",
				"message": "Failed to update component layout",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Return in Strapi format
	response := layout.ToStrapiResponse()
	c.JSON(http.StatusOK, gin.H{
		"data": response,
		"meta": gin.H{},
	})
}

// DeleteComponentLayout handles DELETE /api/component-layouts/:id
func (ctrl *ComponentLayoutController) DeleteComponentLayout(c *gin.Context) {
	db := database.GetDB()
	id := c.Param("id")

	// Convert id to uint
	layoutID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusBadRequest,
				"name":    "ValidationError",
				"message": "Invalid layout ID",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Find and delete layout
	var layout models.ComponentLayout
	if err := db.First(&layout, layoutID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusNotFound,
				"name":    "NotFoundError",
				"message": "Component layout not found",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	if err := db.Delete(&layout).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusInternalServerError,
				"name":    "InternalServerError",
				"message": "Failed to delete component layout",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Return success response (Strapi format)
	response := layout.ToStrapiResponse()
	c.JSON(http.StatusOK, gin.H{
		"data": response,
		"meta": gin.H{},
	})
}