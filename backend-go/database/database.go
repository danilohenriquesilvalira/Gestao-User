package database

import (
	"log"
	"os"
	
	"gorm.io/gorm"
	"gorm.io/driver/postgres"
	"backend-go/models"
)

var DB *gorm.DB

// Initialize connects to PostgreSQL and runs migrations
func Initialize() {
	var err error
	
	// Get database URL from environment
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	// Connect to PostgreSQL
	DB, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("✅ Connected to PostgreSQL database")

	// Run migrations
	if err := runMigrations(); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Seed default roles
	if err := models.SeedRoles(DB); err != nil {
		log.Fatal("Failed to seed roles:", err)
	}

	log.Println("✅ Database initialized successfully")
}

func runMigrations() error {
	// Migrate ComponentLayout
	componentLayout := &models.ComponentLayout{}
	if err := componentLayout.Migrate(DB); err != nil {
		return err
	}

	// Migrate User and Role
	user := &models.User{}
	if err := user.Migrate(DB); err != nil {
		return err
	}

	// Migrate Tags (opcional - usando cache em memória)
	if err := DB.AutoMigrate(&models.Tag{}, &models.TagHistory{}, &models.TagGroup{}, &models.TagGroupMember{}); err != nil {
		log.Printf("⚠️ Tag migration failed (using memory cache): %v", err)
	} else {
		log.Println("✅ Tag tables migrated (backup option)")
	}

	log.Println("✅ Migrations completed")
	return nil
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}