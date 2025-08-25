package models

import (
	"time"
	"gorm.io/gorm"
)

type ComponentLayout struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	ComponentID string    `json:"componentId" gorm:"not null;index"`
	Breakpoint  string    `json:"breakpoint" gorm:"not null;type:varchar(10);check:breakpoint IN ('xs','sm','md','lg','xl','xxl','xxxl','xxxxl')"`
	X           int       `json:"x" gorm:"not null"`
	Y           int       `json:"y" gorm:"not null"`
	Width       int       `json:"width" gorm:"not null"`
	Height      int       `json:"height" gorm:"not null"`
	Scale       float64   `json:"scale" gorm:"default:1.0"`
	ZIndex      int       `json:"zIndex" gorm:"default:1"`
	Opacity     float64   `json:"opacity" gorm:"default:1.0"`
	Rotation    int       `json:"rotation" gorm:"default:0"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// StrapiResponse formats the response to match Strapi's format
type StrapiComponentLayoutResponse struct {
	ID          uint                   `json:"id"`
	DocumentID  string                 `json:"documentId"`
	Attributes  ComponentLayoutAttrs   `json:"attributes"`
}

type ComponentLayoutAttrs struct {
	ComponentID string    `json:"componentId"`
	Breakpoint  string    `json:"breakpoint"`
	X           int       `json:"x"`
	Y           int       `json:"y"`
	Width       int       `json:"width"`
	Height      int       `json:"height"`
	Scale       float64   `json:"scale"`
	ZIndex      int       `json:"zIndex"`
	Opacity     float64   `json:"opacity"`
	Rotation    int       `json:"rotation"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// ToStrapiResponse converts to Strapi compatible format
func (cl *ComponentLayout) ToStrapiResponse() StrapiComponentLayoutResponse {
	return StrapiComponentLayoutResponse{
		ID:         cl.ID,
		DocumentID: string(rune(cl.ID)), // Simple documentId generation
		Attributes: ComponentLayoutAttrs{
			ComponentID: cl.ComponentID,
			Breakpoint:  cl.Breakpoint,
			X:           cl.X,
			Y:           cl.Y,
			Width:       cl.Width,
			Height:      cl.Height,
			Scale:       cl.Scale,
			ZIndex:      cl.ZIndex,
			Opacity:     cl.Opacity,
			Rotation:    cl.Rotation,
			CreatedAt:   cl.CreatedAt,
			UpdatedAt:   cl.UpdatedAt,
		},
	}
}

// Migrate auto-migrates the ComponentLayout table
func (cl *ComponentLayout) Migrate(db *gorm.DB) error {
	return db.AutoMigrate(&ComponentLayout{})
}