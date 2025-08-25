package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"backend-go/database"
	"backend-go/routes"
	"backend-go/services"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// Initialize database
	database.Initialize()

	// Initialize WebSocket Hub and Tag Cache
	log.Printf("🚀 Inicializando sistema de tags...")
	services.GetTagCache() // Inicializar cache
	services.GetWebSocketHub() // Inicializar WebSocket hub
	services.InitializeDefaultTags() // Carregar tags padrão

	// Setup routes
	r := routes.SetupRoutes()

	// Get port from environment or default to 1337
	port := os.Getenv("PORT")
	if port == "" {
		port = "1337"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("🔗 Health check available at: http://localhost:%s/health", port)
	log.Printf("📊 Component layouts API: http://localhost:%s/api/component-layouts", port)
	log.Printf("👥 User management API: http://localhost:%s/api/user-manager", port)

	// Start server
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}