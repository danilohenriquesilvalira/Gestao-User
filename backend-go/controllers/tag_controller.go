package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"backend-go/models"
	"backend-go/services"
)

type TagController struct{}

// GetTags retorna todos os tags do cache
func (ctrl *TagController) GetTags(c *gin.Context) {
	cache := services.GetTagCache()
	tags := cache.GetAllTags()
	
	// Filtrar por status se solicitado
	activeOnly := c.Query("active_only") == "true"
	if activeOnly {
		filteredTags := make(map[string]*models.Tag)
		for name, tag := range tags {
			if tag.IsActive {
				filteredTags[name] = tag
			}
		}
		tags = filteredTags
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    tags,
		"count":   len(tags),
	})
}

// GetTag retorna um tag específico
func (ctrl *TagController) GetTag(c *gin.Context) {
	tagName := c.Param("name")
	if tagName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nome do tag é obrigatório",
		})
		return
	}
	
	cache := services.GetTagCache()
	tag, exists := cache.GetTag(tagName)
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Tag não encontrado",
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    tag,
	})
}

// CreateTag cria novo tag
func (ctrl *TagController) CreateTag(c *gin.Context) {
	var tagData struct {
		Name        string   `json:"name" binding:"required"`
		Type        string   `json:"type" binding:"required"`
		Offset      float64  `json:"offset"`
		Description string   `json:"description"`
		Unit        string   `json:"unit"`
		MinValue    *float64 `json:"min_value"`
		MaxValue    *float64 `json:"max_value"`
		IsActive    *bool    `json:"is_active"`
	}
	
	if err := c.ShouldBindJSON(&tagData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Dados inválidos: " + err.Error(),
		})
		return
	}
	
	// Validar tipo
	validTypes := map[string]bool{"real": true, "bool": true, "int": true, "string": true}
	if !validTypes[tagData.Type] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Tipo inválido. Use: real, bool, int, string",
		})
		return
	}
	
	// Criar tag
	tag := &models.Tag{
		Name:        tagData.Name,
		Type:        tagData.Type,
		Offset:      tagData.Offset,
		Description: tagData.Description,
		Unit:        tagData.Unit,
		MinValue:    tagData.MinValue,
		MaxValue:    tagData.MaxValue,
		IsActive:    true,
		Value:       0, // Valor inicial
	}
	
	// Definir IsActive se fornecido
	if tagData.IsActive != nil {
		tag.IsActive = *tagData.IsActive
	}
	
	// Adicionar ao cache
	cache := services.GetTagCache()
	if err := cache.AddTag(tag); err != nil {
		c.JSON(http.StatusConflict, gin.H{
			"error": err.Error(),
		})
		return
	}
	
	// Forçar salvamento
	if err := cache.SaveToJSON(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao salvar tag: " + err.Error(),
		})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Tag criado com sucesso",
		"data":    tag,
	})
}

// UpdateTag atualiza um tag existente
func (ctrl *TagController) UpdateTag(c *gin.Context) {
	tagName := c.Param("name")
	if tagName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nome do tag é obrigatório",
		})
		return
	}
	
	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Dados inválidos: " + err.Error(),
		})
		return
	}
	
	cache := services.GetTagCache()
	if err := cache.UpdateTag(tagName, updateData); err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Tag atualizado com sucesso",
	})
}

// UpdateTagValue atualiza apenas o valor de um tag
func (ctrl *TagController) UpdateTagValue(c *gin.Context) {
	tagName := c.Param("name")
	if tagName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nome do tag é obrigatório",
		})
		return
	}
	
	var valueData struct {
		Value float64 `json:"value" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&valueData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Valor inválido: " + err.Error(),
		})
		return
	}
	
	cache := services.GetTagCache()
	cache.SetTag(tagName, valueData.Value)
	
	// Broadcast via WebSocket
	hub := services.GetWebSocketHub()
	hub.BroadcastTagUpdate(tagName, valueData.Value)
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Valor do tag atualizado com sucesso",
		"data": map[string]interface{}{
			"name":  tagName,
			"value": valueData.Value,
		},
	})
}

// DeleteTag remove um tag
func (ctrl *TagController) DeleteTag(c *gin.Context) {
	tagName := c.Param("name")
	if tagName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nome do tag é obrigatório",
		})
		return
	}
	
	cache := services.GetTagCache()
	if !cache.RemoveTag(tagName) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Tag não encontrado",
		})
		return
	}
	
	// Forçar salvamento
	if err := cache.SaveToJSON(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao salvar alterações: " + err.Error(),
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Tag removido com sucesso",
	})
}

// BulkUpdateValues atualiza múltiplos valores de tags
func (ctrl *TagController) BulkUpdateValues(c *gin.Context) {
	var bulkData map[string]float64
	if err := c.ShouldBindJSON(&bulkData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Dados inválidos: " + err.Error(),
		})
		return
	}
	
	cache := services.GetTagCache()
	
	// Atualizar todos os valores
	for tagName, value := range bulkData {
		cache.SetTag(tagName, value)
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Valores atualizados com sucesso",
		"count":   len(bulkData),
	})
}

// GetTagStats retorna estatísticas dos tags
func (ctrl *TagController) GetTagStats(c *gin.Context) {
	cache := services.GetTagCache()
	hub := services.GetWebSocketHub()
	
	cacheStats := cache.GetStats()
	hubStats := hub.GetStats()
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"cache":     cacheStats,
			"websocket": hubStats,
			"timestamp": time.Now(),
		},
	})
}

// ExportTags exporta tags para JSON
func (ctrl *TagController) ExportTags(c *gin.Context) {
	cache := services.GetTagCache()
	tags := cache.GetAllTags()
	
	c.Header("Content-Type", "application/json")
	c.Header("Content-Disposition", "attachment; filename=tags_export.json")
	
	c.JSON(http.StatusOK, gin.H{
		"export_date": time.Now(),
		"total_tags":  len(tags),
		"tags":        tags,
	})
}

// ImportTags importa tags do JSON
func (ctrl *TagController) ImportTags(c *gin.Context) {
	var importData struct {
		Tags map[string]*models.Tag `json:"tags" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&importData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Dados de importação inválidos: " + err.Error(),
		})
		return
	}
	
	cache := services.GetTagCache()
	imported := 0
	errors := []string{}
	
	for name, tag := range importData.Tags {
		tag.Name = name // Garantir consistência
		if err := cache.AddTag(tag); err != nil {
			errors = append(errors, "Tag "+name+": "+err.Error())
		} else {
			imported++
		}
	}
	
	// Salvar alterações
	if err := cache.SaveToJSON(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao salvar tags importados: " + err.Error(),
		})
		return
	}
	
	response := gin.H{
		"success":  true,
		"imported": imported,
		"total":    len(importData.Tags),
	}
	
	if len(errors) > 0 {
		response["errors"] = errors
	}
	
	c.JSON(http.StatusOK, response)
}