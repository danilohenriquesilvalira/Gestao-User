package models

import (
	"time"
)

// Tag representa um tag do sistema de automação
type Tag struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"uniqueIndex;not null"`
	Value       float64   `json:"value"`
	Type        string    `json:"type"`        // "real", "bool", "int", "string"
	Offset      float64   `json:"offset"`      // Offset no PLC
	Description string    `json:"description"`
	Unit        string    `json:"unit"`        // "°C", "%", "bar", etc.
	MinValue    *float64  `json:"min_value"`   // Valor mínimo permitido
	MaxValue    *float64  `json:"max_value"`   // Valor máximo permitido
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// TagHistory para histórico de valores (opcional)
type TagHistory struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	TagID     uint      `json:"tag_id" gorm:"index"`
	Tag       Tag       `json:"tag" gorm:"foreignKey:TagID"`
	Value     float64   `json:"value"`
	Timestamp time.Time `json:"timestamp"`
}

// TagGroup para agrupar tags relacionados
type TagGroup struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"uniqueIndex;not null"`
	Description string `json:"description"`
	IsActive    bool   `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// TagGroupMember para relacionamento many-to-many
type TagGroupMember struct {
	TagID   uint `json:"tag_id" gorm:"primaryKey"`
	GroupID uint `json:"group_id" gorm:"primaryKey"`
	Tag     Tag  `json:"tag" gorm:"foreignKey:TagID"`
	Group   TagGroup `json:"group" gorm:"foreignKey:GroupID"`
}

// WebSocketMessage estrutura para mensagens WebSocket
type WebSocketMessage struct {
	Type      string                 `json:"type"`
	Timestamp time.Time             `json:"timestamp"`
	Data      map[string]interface{} `json:"data"`
}