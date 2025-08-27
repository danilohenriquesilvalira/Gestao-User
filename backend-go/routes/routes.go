package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"backend-go/controllers"
	"backend-go/middleware"
	"backend-go/services"
	"os"
	"time"
)

// SetupRoutes configures all routes
func SetupRoutes() *gin.Engine {
	// Initialize Gin
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	
	// Middleware de logging personalizado apenas para erros importantes
	if os.Getenv("GIN_MODE") != "release" {
		r.Use(gin.Logger())
	}
	r.Use(gin.Recovery())

	// Configure CORS
	config := cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "Accept", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
		AllowWildcard:    false,
	}
	r.Use(cors.New(config))

	// Manual OPTIONS handler para debug
	r.OPTIONS("/*path", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", c.GetHeader("Origin"))
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Length, Content-Type, Authorization, Accept, X-Requested-With")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Status(204)
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Backend Go is running",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// API group
	api := r.Group("/api")

	// Component Layout routes (Strapi compatible)
	componentLayoutController := &controllers.ComponentLayoutController{}
	api.GET("/component-layouts", componentLayoutController.GetComponentLayouts)
	api.POST("/component-layouts", componentLayoutController.CreateComponentLayout)
	api.PUT("/component-layouts/:id", componentLayoutController.UpdateComponentLayout)
	api.DELETE("/component-layouts/:id", componentLayoutController.DeleteComponentLayout)


	// Authentication routes (Strapi compatible)
	authController := &controllers.AuthController{}
	auth := api.Group("/auth")
	{
		auth.POST("/local", authController.Login)
	}

	// User Management routes (protegidas)
	userController := &controllers.UserController{}
	userManager := api.Group("/user-manager")
	{
		// Rotas públicas (apenas roles para formulários)
		userManager.GET("/roles", userController.ListRoles)
		
		// Rotas protegidas que requerem autenticação
		protected := userManager.Group("/", middleware.AuthMiddleware())
		{
			// Listar usuários - requer permissão de visualizar usuários
			protected.GET("/users", middleware.RequirePermission("users.view"), userController.ListUsers)
			
			// Criar usuário - requer permissão de gerenciar usuários
			protected.POST("/create", middleware.RequirePermission("users.manage"), userController.CreateUser)
			
			// Atualizar usuário - requer permissão de gerenciar usuários
			protected.PUT("/update/:id", middleware.RequirePermission("users.manage"), userController.UpdateUser)
			
			// Deletar usuário - requer permissão de gerenciar usuários + nível alto
			protected.DELETE("/delete/:id", middleware.RequireLevel(80), userController.DeleteUser)
		}
	}

	// WebSocket route
	hub := services.GetWebSocketHub()
	r.GET("/ws", func(c *gin.Context) {
		hub.HandleWebSocket(c.Writer, c.Request)
	})

	// S7 PLC Status route
	r.GET("/api/plc/status", func(c *gin.Context) {
		s7plc := services.GetS7PLCConnector()
		status := s7plc.GetStatus()
		c.JSON(200, status)
	})

	// ✅ DATABASE MONITOR ROUTES - FOCO APENAS NO BANCO DE DADOS
	databaseMonitorController := &controllers.DatabaseMonitorController{}
	databaseAPI := api.Group("/database")
	{
		databaseAPI.GET("/stats", databaseMonitorController.GetDatabaseStats)
		databaseAPI.GET("/logs", databaseMonitorController.GetDatabaseLogs)
		databaseAPI.GET("/all", databaseMonitorController.GetDatabaseData) // Todos os dados do BD
		databaseAPI.GET("/tables", databaseMonitorController.GetAllTables) // Listar TODAS as tabelas
	}

	return r
}