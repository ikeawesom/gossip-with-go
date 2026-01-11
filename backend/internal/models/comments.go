package models

import (
	"time"

	"gorm.io/gorm"
)

type Comment struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	PostID          uint           `gorm:"not null;index" json:"post_id"`
	ParentCommentID *uint          `gorm:"index" json:"parent_comment_id"` // pointer allow for NULL values
	UserID          uint           `gorm:"not null;index" json:"user_id"`

	Content         string         `gorm:"type:text;not null" json:"content"`
	LikeCount       int            `gorm:"default:0;not null" json:"like_count"`

	IsPinned        bool           `gorm:"default:false;not null" json:"is_pinned"`

	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Comment) TableName() string {
	return "comments"
}

// check for root comment
func (c *Comment) IsRootComment() bool {
	return c.ParentCommentID == nil
}

// check for edit
func (c *Comment) IsEdited() bool {
	return c.UpdatedAt.Sub(c.CreatedAt) > time.Second
}