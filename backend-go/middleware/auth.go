package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"backend-go/database"
	"backend-go/models"
)

// AuthMiddleware verifica se o usuário está autenticado
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": map[string]interface{}{
					"status":  401,
					"name":    "UnauthorizedError",
					"message": "Token de acesso necessário",
					"details": gin.H{},
				},
			})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": map[string]interface{}{
					"status":  401,
					"name":    "UnauthorizedError",
					"message": "Formato de token inválido",
					"details": gin.H{},
				},
			})
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte("lb8ETlEcHM49QQuDY2iKCQ=="), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": map[string]interface{}{
					"status":  401,
					"name":    "UnauthorizedError",
					"message": "Token inválido ou expirado",
					"details": gin.H{},
				},
			})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": map[string]interface{}{
					"status":  401,
					"name":    "UnauthorizedError",
					"message": "Claims do token inválidos",
					"details": gin.H{},
				},
			})
			c.Abort()
			return
		}

		userID := claims["id"].(float64)
		db := database.GetDB()
		var user models.User
		if err := db.Preload("Role").First(&user, uint(userID)).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": map[string]interface{}{
					"status":  401,
					"name":    "UnauthorizedError",
					"message": "Usuário não encontrado",
					"details": gin.H{},
				},
			})
			c.Abort()
			return
		}

		if user.Blocked {
			c.JSON(http.StatusForbidden, gin.H{
				"error": map[string]interface{}{
					"status":  403,
					"name":    "ForbiddenError",
					"message": "Usuário bloqueado",
					"details": gin.H{},
				},
			})
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Next()
	}
}

// RequirePermission middleware que exige permissão específica
func RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userInterface, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": map[string]interface{}{
					"status":  401,
					"name":    "UnauthorizedError",
					"message": "Usuário não autenticado",
					"details": gin.H{},
				},
			})
			c.Abort()
			return
		}

		user, ok := userInterface.(models.User)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": map[string]interface{}{
					"status":  500,
					"name":    "InternalServerError",
					"message": "Erro interno de autenticação",
					"details": gin.H{},
				},
			})
			c.Abort()
			return
		}

		if !user.HasPermission(permission) {
			c.JSON(http.StatusForbidden, gin.H{
				"error": map[string]interface{}{
					"status":  403,
					"name":    "ForbiddenError",
					"message": "Permissão insuficiente para esta ação",
					"details": gin.H{"required_permission": permission},
				},
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireLevel middleware que exige nível mínimo
func RequireLevel(minLevel int) gin.HandlerFunc {
	return func(c *gin.Context) {
		userInterface, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": map[string]interface{}{
					"status":  401,
					"name":    "UnauthorizedError",
					"message": "Usuário não autenticado",
					"details": gin.H{},
				},
			})
			c.Abort()
			return
		}

		user, ok := userInterface.(models.User)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": map[string]interface{}{
					"status":  500,
					"name":    "InternalServerError",
					"message": "Erro interno de autenticação",
					"details": gin.H{},
				},
			})
			c.Abort()
			return
		}

		if !user.HasLevel(minLevel) {
			c.JSON(http.StatusForbidden, gin.H{
				"error": map[string]interface{}{
					"status":  403,
					"name":    "ForbiddenError",
					"message": "Nível de acesso insuficiente para esta ação",
					"details": gin.H{"required_level": minLevel, "user_level": user.Role.Level},
				},
			})
			c.Abort()
			return
		}

		c.Next()
	}
}