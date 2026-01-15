package models

import "time"

type Media struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Url    string `gorm:"not null;index" json:"url"`
	PostID uint   `gorm:"not null;index" json:"post_id"`
	UserID uint   `gorm:"not null;index" json:"user_id"`

	CreatedAt time.Time `json:"created_at"`
}

func (Media) TableName() string {
	return "media"
}