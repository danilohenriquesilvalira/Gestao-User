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

	// Initialize WebSocket Hub
	log.Printf("🚀 Inicializando sistema WebSocket...")
	services.GetWebSocketHub() // Inicializar WebSocket hub
	
	// Initialize S7 PLC Connection
	log.Printf("🔌 Inicializando conexão S7 PLC...")
	services.GetS7PLCConnector() // Inicializar conexão S7 PLC

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