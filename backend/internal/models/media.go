package models

import (
	"time"

	"gorm.io/gorm"
)

type Media struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	UserID     uint   		  `gorm:"not null;index" json:"user_id"`
	PostID     uint           `gorm:"not null;index" json:"post_id"`
	MediaURL   string         `gorm:"type:varchar(500);not null" json:"media_url"`
	MediaOrder int            `gorm:"default:0;not null" json:"media_order"`

	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Media) TableName() string {
	return "media"
}