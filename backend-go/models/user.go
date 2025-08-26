package models

import (
	"encoding/json"
	"time"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"unique;not null"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Password  string    `json:"-" gorm:"not null"` // Hidden in JSON
	Role      Role      `json:"role" gorm:"foreignKey:RoleID"`
	RoleID    uint      `json:"roleId" gorm:"not null"`
	Confirmed bool      `json:"confirmed" gorm:"default:true"`
	Blocked   bool      `json:"blocked" gorm:"default:false"`
	Provider  string    `json:"provider" gorm:"default:local"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Role struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"unique;not null;index"`
	DisplayName string    `json:"displayName" gorm:"not null"`
	Description string    `json:"description"`
	Type        string    `json:"type" gorm:"not null;index"`
	Level       int       `json:"level" gorm:"not null;default:0"` // Nível de permissão (0=visitante, 100=admin)
	Permissions string    `json:"permissions" gorm:"type:text"` // Permissões como string JSON
	Active      bool      `json:"active" gorm:"default:true"`     // Role ativa ou não
	Users       []User    `json:"users,omitempty" gorm:"foreignKey:RoleID"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// HashPassword hashes the user password
func (u *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// CheckPassword verifies the password
func (u *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}

// BeforeCreate GORM hook to hash password before saving
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.Password != "" {
		return u.HashPassword()
	}
	return nil
}

// BeforeUpdate GORM hook to hash password before updating
func (u *User) BeforeUpdate(tx *gorm.DB) error {
	// Only hash if password is being changed
	if tx.Statement.Changed("password") && u.Password != "" {
		return u.HashPassword()
	}
	return nil
}

// Migrate auto-migrates the User and Role tables
func (u *User) Migrate(db *gorm.DB) error {
	if err := db.AutoMigrate(&Role{}); err != nil {
		return err
	}
	return db.AutoMigrate(&User{})
}

// SeedRoles creates default roles if they don't exist
func SeedRoles(db *gorm.DB) error {
	roleConfigs := []struct {
		Name        string
		DisplayName string
		Description string
		Type        string
		Level       int
		Permissions []string
	}{
		{
			Name: "admin", DisplayName: "Administrador", Description: "Acesso total ao sistema",
			Type: "admin", Level: 100, Permissions: []string{"*"},
		},
		{
			Name: "gerente", DisplayName: "Gerente", Description: "Gerenciamento operacional e supervisão",
			Type: "gerente", Level: 80, Permissions: []string{"users.view", "users.manage", "reports.view", "system.monitor", "eclusa.control"},
		},
		{
			Name: "supervisor", DisplayName: "Supervisor", Description: "Supervisão de operações e equipe",
			Type: "supervisor", Level: 70, Permissions: []string{"users.view", "users.manage", "reports.view", "eclusa.control", "maintenance.schedule"},
		},
		{
			Name: "tecnico", DisplayName: "Técnico", Description: "Suporte técnico e manutenção especializada",
			Type: "tecnico", Level: 60, Permissions: []string{"maintenance.all", "diagnostics.run", "system.debug", "eclusa.maintenance"},
		},
		{
			Name: "operador", DisplayName: "Operador", Description: "Operação diária do sistema e eclusa",
			Type: "operador", Level: 50, Permissions: []string{"eclusa.operate", "reports.basic", "system.monitor"},
		},
		{
			Name: "visitante", DisplayName: "Visitante", Description: "Acesso limitado apenas para visualização",
			Type: "visitante", Level: 10, Permissions: []string{"dashboard.view", "reports.basic"},
		},
	}

	for _, config := range roleConfigs {
		var existingRole Role
		if err := db.Where("name = ?", config.Name).First(&existingRole).Error; err == gorm.ErrRecordNotFound {
			// Criar nova role
			role := Role{
				Name:        config.Name,
				DisplayName: config.DisplayName,
				Description: config.Description,
				Type:        config.Type,
				Level:       config.Level,
				Active:      true,
			}
			role.SetPermissions(config.Permissions)
			
			if err := db.Create(&role).Error; err != nil {
				return err
			}
		} else {
			// Atualizar role existente
			existingRole.DisplayName = config.DisplayName
			existingRole.Description = config.Description
			existingRole.Level = config.Level
			existingRole.Active = true
			existingRole.SetPermissions(config.Permissions)
			db.Save(&existingRole)
		}
	}
	return nil
}

// GetPermissions retorna as permissões como slice
func (r *Role) GetPermissions() []string {
	var permissions []string
	if r.Permissions != "" {
		json.Unmarshal([]byte(r.Permissions), &permissions)
	}
	return permissions
}

// SetPermissions define as permissões a partir de um slice
func (r *Role) SetPermissions(permissions []string) error {
	data, err := json.Marshal(permissions)
	if err != nil {
		return err
	}
	r.Permissions = string(data)
	return nil
}

// HasPermission verifica se o usuário tem uma permissão específica
func (u *User) HasPermission(permission string) bool {
	permissions := u.Role.GetPermissions()
	if u.Role.Name == "admin" || contains(permissions, "*") {
		return true
	}
	return contains(permissions, permission)
}

// HasLevel verifica se o usuário tem nível mínimo necessário
func (u *User) HasLevel(minLevel int) bool {
	return u.Role.Level >= minLevel
}

// contains verifica se um slice contém um item
func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}