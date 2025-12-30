package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Like struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	UserID       uint      `gorm:"not null;index:idx_user_target" json:"user_id"`
	
	LikeableType string    `gorm:"type:varchar(20);not null;index:idx_user_target" json:"likeable_type"` // "post" or "comment"
	LikeableID   uint      `gorm:"not null;index:idx_user_target" json:"likeable_id"`

	CreatedAt    time.Time `json:"created_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Like) TableName() string {
	return "likes"
}

func (l *Like) BeforeCreate(tx *gorm.DB) error {
	if l.LikeableType != "post" && l.LikeableType != "comment" {
		return errors.New("likeable_type must be either 'post' or 'comment'")
	}
	return nil
}