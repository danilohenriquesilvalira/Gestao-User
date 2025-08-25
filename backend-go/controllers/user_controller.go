package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"backend-go/database"
	"backend-go/models"
)

type UserController struct{}

// ListUsers handles GET /api/user-manager/users
func (ctrl *UserController) ListUsers(c *gin.Context) {
	db := database.GetDB()
	var users []models.User

	// Obter usuário atual
	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": map[string]interface{}{
				"status":  401,
				"name":    "UnauthorizedError",
				"message": "Usuário não autenticado",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	currentUser, ok := userInterface.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  500,
				"name":    "InternalServerError",
				"message": "Erro interno de autenticação",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	var query *gorm.DB = db.Preload("Role")

	// Sistema hierárquico de permissões
	switch currentUser.Role.Name {
	case "admin":
		// Admin vê todos os usuários
		query = query.Find(&users)
	case "gerente":
		// Gerente NÃO vê admin
		query = query.Joins("JOIN roles ON users.role_id = roles.id").
			Where("roles.name != ?", "admin").Find(&users)
	case "supervisor":
		// Supervisor NÃO vê admin nem gerente
		query = query.Joins("JOIN roles ON users.role_id = roles.id").
			Where("roles.name NOT IN ?", []string{"admin", "gerente"}).Find(&users)
	default:
		// Técnico, Operador, Visitante só veem próprio perfil
		query = query.Where("id = ?", currentUser.ID).Find(&users)
	}

	if query.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  500,
				"name":    "InternalServerError", 
				"message": "Erro ao buscar usuários: " + query.Error.Error(),
				"details": map[string]interface{}{},
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

// ListRoles handles GET /api/user-manager/roles  
func (ctrl *UserController) ListRoles(c *gin.Context) {
	db := database.GetDB()
	var roles []models.Role

	if err := db.Find(&roles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusInternalServerError,
				"name":    "InternalServerError",
				"message": "Erro ao buscar roles: " + err.Error(),
				"details": map[string]interface{}{},
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"roles": roles,
	})
}

// CreateUser handles POST /api/user-manager/create
func (ctrl *UserController) CreateUser(c *gin.Context) {
	db := database.GetDB()

	var request struct {
		Username  string `json:"username" binding:"required"`
		Email     string `json:"email" binding:"required,email"`
		Password  string `json:"password" binding:"required,min=6"`
		Role      uint   `json:"role" binding:"required"`
		RoleName  string `json:"roleName"` // Opção de passar nome da role
		Confirmed *bool  `json:"confirmed"`
		Blocked   *bool  `json:"blocked"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusBadRequest,
				"name":    "ValidationError",
				"message": "Username, email, password e role são obrigatórios",
				"details": map[string]interface{}{
					"errors": err.Error(),
				},
			},
		})
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := db.Where("email = ? OR username = ?", request.Email, request.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusBadRequest,
				"name":    "ConflictError",
				"message": "Usuário com este email ou username já existe",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Verify role exists
	var role models.Role
	if request.RoleName != "" {
		// Buscar por nome da role
		if err := db.Where("name = ? AND active = ?", request.RoleName, true).First(&role).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": map[string]interface{}{
					"status":  http.StatusBadRequest,
					"name":    "ValidationError",
					"message": "Role inválida ou inativa",
					"details": map[string]interface{}{},
				},
			})
			return
		}
	} else {
		// Buscar por ID da role
		if err := db.Where("id = ? AND active = ?", request.Role, true).First(&role).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": map[string]interface{}{
					"status":  http.StatusBadRequest,
					"name":    "ValidationError",
					"message": "Role inválida ou inativa",
					"details": map[string]interface{}{},
				},
			})
			return
		}
	}

	// Verificar se usuário atual pode criar usuário com esta role
	if userInterface, exists := c.Get("user"); exists {
		currentUser, ok := userInterface.(models.User)
		if ok && currentUser.Role.Level <= role.Level && currentUser.Role.Name != "admin" {
			c.JSON(http.StatusForbidden, gin.H{
				"error": map[string]interface{}{
					"status":  http.StatusForbidden,
					"name":    "ForbiddenError",
					"message": "Você não pode criar usuários com nível igual ou superior ao seu",
					"details": map[string]interface{}{
						"your_level": currentUser.Role.Level,
						"requested_level": role.Level,
					},
				},
			})
			return
		}
	}

	// Set defaults
	confirmed := true
	blocked := false
	if request.Confirmed != nil {
		confirmed = *request.Confirmed
	}
	if request.Blocked != nil {
		blocked = *request.Blocked
	}

	// Create user
	user := models.User{
		Username:  request.Username,
		Email:     request.Email,
		Password:  request.Password, // Will be hashed by BeforeCreate hook
		RoleID:    role.ID, // Usar o ID da role encontrada
		Confirmed: confirmed,
		Blocked:   blocked,
		Provider:  "local",
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusInternalServerError,
				"name":    "InternalServerError",
				"message": "Erro ao criar usuário: " + err.Error(),
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Load user with role
	if err := db.Preload("Role").First(&user, user.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusInternalServerError,
				"name":    "InternalServerError",
				"message": "Erro ao carregar usuário criado",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"user":    user,
		"message": "Usuário criado com sucesso!",
	})
}

// UpdateUser handles PUT /api/user-manager/update/:id
func (ctrl *UserController) UpdateUser(c *gin.Context) {
	db := database.GetDB()
	id := c.Param("id")

	userID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusBadRequest,
				"name":    "ValidationError",
				"message": "ID de usuário inválido",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	var request struct {
		Username  string `json:"username"`
		Email     string `json:"email"`
		Password  string `json:"password"`
		Role      *uint  `json:"role"`
		Confirmed *bool  `json:"confirmed"`
		Blocked   *bool  `json:"blocked"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusBadRequest,
				"name":    "ValidationError",
				"message": "Dados de atualização inválidos",
				"details": map[string]interface{}{
					"errors": err.Error(),
				},
			},
		})
		return
	}

	// Find user
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusNotFound,
				"name":    "NotFoundError",
				"message": "Usuário não encontrado",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Update fields if provided
	if request.Username != "" {
		user.Username = request.Username
	}
	if request.Email != "" {
		user.Email = request.Email
	}
	if request.Password != "" {
		user.Password = request.Password // Will be hashed by BeforeUpdate hook
	}
	if request.Role != nil {
		// Verify role exists
		var role models.Role
		if err := db.First(&role, *request.Role).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": map[string]interface{}{
					"status":  http.StatusBadRequest,
					"name":    "ValidationError",
					"message": "Role inválida",
					"details": map[string]interface{}{},
				},
			})
			return
		}
		user.RoleID = *request.Role
	}
	if request.Confirmed != nil {
		user.Confirmed = *request.Confirmed
	}
	if request.Blocked != nil {
		user.Blocked = *request.Blocked
	}

	// Save changes
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusInternalServerError,
				"name":    "InternalServerError",
				"message": "Erro ao atualizar usuário: " + err.Error(),
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Load user with role
	if err := db.Preload("Role").First(&user, user.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusInternalServerError,
				"name":    "InternalServerError",
				"message": "Erro ao carregar usuário atualizado",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":    user,
		"message": "Usuário atualizado com sucesso!",
	})
}

// DeleteUser handles DELETE /api/user-manager/delete/:id
func (ctrl *UserController) DeleteUser(c *gin.Context) {
	db := database.GetDB()
	id := c.Param("id")

	userID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusBadRequest,
				"name":    "ValidationError",
				"message": "ID de usuário inválido",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Find user
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusNotFound,
				"name":    "NotFoundError",
				"message": "Usuário não encontrado",
				"details": map[string]interface{}{},
			},
		})
		return
	}

	// Delete user
	if err := db.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": map[string]interface{}{
				"status":  http.StatusInternalServerError,
				"name":    "InternalServerError",
				"message": "Erro ao deletar usuário: " + err.Error(),
				"details": map[string]interface{}{},
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Usuário deletado com sucesso!",
	})
}