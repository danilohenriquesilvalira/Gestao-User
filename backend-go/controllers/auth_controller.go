package controllers

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"backend-go/database"
	"backend-go/models"
)

type AuthController struct{}

type LoginRequest struct {
	Identifier string `json:"identifier" binding:"required"` // username ou email
	Password   string `json:"password" binding:"required"`
}

type LoginResponse struct {
	JWT  string      `json:"jwt"`
	User models.User `json:"user"`
}

// Login handles POST /api/auth/local
func (ctrl *AuthController) Login(c *gin.Context) {
	// Log detalhado da requisição
	fmt.Printf("🔍 LOGIN REQUEST DEBUG:\n")
	fmt.Printf("   Method: %s\n", c.Request.Method)
	fmt.Printf("   URL: %s\n", c.Request.URL.String())
	fmt.Printf("   Headers: %+v\n", c.Request.Header)
	fmt.Printf("   Content-Type: %s\n", c.GetHeader("Content-Type"))
	fmt.Printf("   Origin: %s\n", c.GetHeader("Origin"))

	db := database.GetDB()
	var request LoginRequest

	// Debug: Log do body da requisição
	body, _ := c.GetRawData()
	fmt.Printf("   Raw Body: %s\n", string(body))
	c.Request.Body = io.NopCloser(bytes.NewBuffer(body))
	
	if err := c.ShouldBindJSON(&request); err != nil {
		fmt.Printf("❌ JSON Bind Error: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  400,
				"name":    "ValidationError",
				"message": "Username/email e senha são obrigatórios",
				"details": gin.H{},
			},
		})
		return
	}
	
	fmt.Printf("   Parsed Request: %+v\n", request)

	// Find user by username or email
	var user models.User
	if err := db.Preload("Role").Where("username = ? OR email = ?", request.Identifier, request.Identifier).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  400,
				"name":    "ValidationError", 
				"message": "Credenciais inválidas",
				"details": gin.H{},
			},
		})
		return
	}

	// Check if user is blocked
	if user.Blocked {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  400,
				"name":    "ValidationError",
				"message": "Usuário bloqueado",
				"details": gin.H{},
			},
		})
		return
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  400,
				"name":    "ValidationError",
				"message": "Credenciais inválidas",
				"details": gin.H{},
			},
		})
		return
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
		"role":     user.Role.Name,
		"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	})

	tokenString, err := token.SignedString([]byte("lb8ETlEcHM49QQuDY2iKCQ=="))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  500,
				"name":    "InternalServerError",
				"message": "Erro ao gerar token",
				"details": gin.H{},
			},
		})
		return
	}

	// Remove password from response
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"jwt":  tokenString,
		"user": user,
	})
}