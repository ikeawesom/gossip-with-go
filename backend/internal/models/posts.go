package models

import (
	"time"

	"gorm.io/gorm"
)

type Post struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	UserID    uint   `gorm:"not null;index" json:"user_id"`
	Topic     string   `gorm:"not null;index" json:"topic"`
	Title	  string `gorm:"type:text;not null" json:"title"`
	Content   string `gorm:"type:text;not null" json:"content"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Post) TableName() string {
	return "posts"
}

type PostResponse struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	Topic     string   `json:"topic"`
	Title	  string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (p *Post) ToResponse() PostResponse {
	return PostResponse{
		ID:       p.ID,
		UserID:   p.UserID,
		Topic:  p.Topic,
		Title:    p.Title,
		Content:  p.Content,
		CreatedAt: p.CreatedAt,
		UpdatedAt: p.UpdatedAt,
	}
}