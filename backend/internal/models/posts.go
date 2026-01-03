package models

import (
	"time"

	"gorm.io/gorm"
)

type Post struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	UserID    uint   `gorm:"not null;index" json:"user_id"`
	Topic     uint   `gorm:"not null;index" json:"topic"`
	Title	  string `gorm:"type:text;not null" json:"title"`
	Content   string `gorm:"type:text;not null" json:"content"`

	// engagement metrics for scoring
	LikeCount    int            `gorm:"default:0;not null" json:"like_count"`
	CommentCount int            `gorm:"default:0;not null" json:"comment_count"`
	ViewCount    int            `gorm:"default:0;not null" json:"view_count"`
	RepostCount  int            `gorm:"default:0;not null" json:"repost_count"`
	Score        float64        `gorm:"-" json:"score,omitempty"` // don't need to store in DB (calculated value)

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
	Topic     uint   `json:"topic"`
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