package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"backend-go/models"
)

// Strapi data structures for migration
type StrapiComponentLayout struct {
	ID          int       `json:"id"`
	ComponentID string    `json:"component_id"`
	Breakpoint  string    `json:"breakpoint"`
	X           int       `json:"x"`
	Y           int       `json:"y"`
	Width       int       `json:"width"`
	Height      int       `json:"height"`
	Scale       float64   `json:"scale"`
	ZIndex      int       `json:"z_index"`
	Opacity     float64   `json:"opacity"`
	Rotation    int       `json:"rotation"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type StrapiUser struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	Role      int       `json:"role"`
	Confirmed bool      `json:"confirmed"`
	Blocked   bool      `json:"blocked"`
	Provider  string    `json:"provider"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type StrapiRole struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
}

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// Connect to database
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("✅ Connected to PostgreSQL for migration")

	// Run migrations
	if err := runMigrations(db); err != nil {
		log.Fatal("Migration failed:", err)
	}

	log.Println("✅ Migration completed successfully!")
}

func runMigrations(db *gorm.DB) error {
	log.Println("🔄 Starting Strapi to Go migration...")

	// Auto-migrate tables first
	if err := db.AutoMigrate(&models.Role{}, &models.User{}, &models.ComponentLayout{}); err != nil {
		return fmt.Errorf("failed to migrate tables: %v", err)
	}

	// Seed roles first
	if err := models.SeedRoles(db); err != nil {
		return fmt.Errorf("failed to seed roles: %v", err)
	}
	log.Println("✅ Roles seeded")

	// Migrate Component Layouts
	if err := migrateComponentLayouts(db); err != nil {
		return fmt.Errorf("failed to migrate component layouts: %v", err)
	}

	// Migrate Users (if they exist)
	if err := migrateUsers(db); err != nil {
		log.Println("⚠️  User migration failed (this is OK if no users exist yet):", err)
	}

	return nil
}

func migrateComponentLayouts(db *gorm.DB) error {
	log.Println("🔄 Migrating component layouts...")

	// Query existing component layouts from Strapi tables
	var strapiLayouts []StrapiComponentLayout
	
	// Try to fetch from the actual Strapi table
	if err := db.Raw(`
		SELECT 
			id, 
			component_id, 
			breakpoint, 
			x, y, width, height, 
			COALESCE(scale, 1.0) as scale,
			COALESCE(z_index, 1) as z_index,
			COALESCE(opacity, 1.0) as opacity,
			COALESCE(rotation, 0) as rotation,
			created_at, 
			updated_at
		FROM component_layout 
		ORDER BY id
	`).Scan(&strapiLayouts).Error; err != nil {
		log.Printf("⚠️  No existing component layouts found or table doesn't exist: %v", err)
		return nil // This is OK, might be a fresh install
	}

	if len(strapiLayouts) == 0 {
		log.Println("ℹ️  No component layouts to migrate")
		return nil
	}

	// Convert and insert
	for _, strapiLayout := range strapiLayouts {
		goLayout := models.ComponentLayout{
			ID:          uint(strapiLayout.ID),
			ComponentID: strapiLayout.ComponentID,
			Breakpoint:  strapiLayout.Breakpoint,
			X:           strapiLayout.X,
			Y:           strapiLayout.Y,
			Width:       strapiLayout.Width,
			Height:      strapiLayout.Height,
			Scale:       strapiLayout.Scale,
			ZIndex:      strapiLayout.ZIndex,
			Opacity:     strapiLayout.Opacity,
			Rotation:    strapiLayout.Rotation,
			CreatedAt:   strapiLayout.CreatedAt,
			UpdatedAt:   strapiLayout.UpdatedAt,
		}

		// Insert or update
		if err := db.Save(&goLayout).Error; err != nil {
			log.Printf("❌ Failed to migrate layout %d: %v", strapiLayout.ID, err)
		} else {
			log.Printf("✅ Migrated component layout: %s (%s)", strapiLayout.ComponentID, strapiLayout.Breakpoint)
		}
	}

	log.Printf("✅ Migrated %d component layouts", len(strapiLayouts))
	return nil
}

func migrateUsers(db *gorm.DB) error {
	log.Println("🔄 Migrating users...")

	// Query existing users from Strapi users table
	var strapiUsers []StrapiUser
	
	if err := db.Raw(`
		SELECT 
			u.id, 
			u.username, 
			u.email, 
			u.password,
			u.role as role,
			COALESCE(u.confirmed, true) as confirmed,
			COALESCE(u.blocked, false) as blocked,
			COALESCE(u.provider, 'local') as provider,
			u.created_at, 
			u.updated_at
		FROM up_users u
		ORDER BY u.id
	`).Scan(&strapiUsers).Error; err != nil {
		return fmt.Errorf("failed to query Strapi users: %v", err)
	}

	if len(strapiUsers) == 0 {
		log.Println("ℹ️  No users to migrate")
		return nil
	}

	// Convert and insert
	for _, strapiUser := range strapiUsers {
		// Find the role ID in our new system
		var role models.Role
		if err := db.First(&role, strapiUser.Role).Error; err != nil {
			log.Printf("⚠️  Role %d not found for user %s, skipping", strapiUser.Role, strapiUser.Username)
			continue
		}

		goUser := models.User{
			ID:        uint(strapiUser.ID),
			Username:  strapiUser.Username,
			Email:     strapiUser.Email,
			Password:  strapiUser.Password, // Already hashed from Strapi
			RoleID:    role.ID,
			Confirmed: strapiUser.Confirmed,
			Blocked:   strapiUser.Blocked,
			Provider:  strapiUser.Provider,
			CreatedAt: strapiUser.CreatedAt,
			UpdatedAt: strapiUser.UpdatedAt,
		}

		// Insert or update (skip password hashing since it's already hashed)
		if err := db.Session(&gorm.Session{SkipHooks: true}).Save(&goUser).Error; err != nil {
			log.Printf("❌ Failed to migrate user %s: %v", strapiUser.Username, err)
		} else {
			log.Printf("✅ Migrated user: %s (%s)", strapiUser.Username, role.Name)
		}
	}

	log.Printf("✅ Migrated %d users", len(strapiUsers))
	return nil
}