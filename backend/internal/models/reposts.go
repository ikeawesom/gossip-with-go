// backend/internal/models/reposts.go
package models

import (
	"time"

	"gorm.io/gorm"
)

type Repost struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `gorm:"not null;index:idx_user_post" json:"user_id"`
	PostID    uint           `gorm:"not null;index:idx_user_post" json:"post_id"`

	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	Visibility string `gorm:"type:varchar(20);not null;default:'public'" json:"visibility"` // "public", "friends", "private"
}

func (Repost) TableName() string {
	return "reposts"
}

func (r *Repost) IsVisibleTo(viewerID uint, areFriends bool) bool {
	switch r.Visibility {
	case "public":
		return true
	case "friends":
		return areFriends || viewerID == r.UserID
	case "private":
		return viewerID == r.UserID
	default:
		return false
	}
}