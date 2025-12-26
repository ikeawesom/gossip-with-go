package models

import "time"

type Like struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     uint      `gorm:"not null;index" json:"user_id"`
	LikeType   uint      `gorm:"not null" json:"like_type"`       // 1 for post, 2 for comment
	TargetID   uint      `gorm:"not null;index" json:"target_id"` // can be comments or posts
	LikeToggle uint      `gorm:"not null" json:"like_toggle"`     // 1 for like, 2 for dislike
	CreatedAt  time.Time `json:"created_at"`
}

func (Like) TableName() string {
	return "likes"
}

func (l *Like) ToResponse() Like {
	return Like{
		ID:         l.ID,
		UserID:     l.UserID,
		LikeType:   l.LikeType,
		TargetID:   l.TargetID,
		LikeToggle: l.LikeToggle,
		CreatedAt:  l.CreatedAt,
	}
}