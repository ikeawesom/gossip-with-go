package models

import "time"

type Comment struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	PostID          uint      `gorm:"not null;index" json:"post_id"`
	ParentCommentID uint      `gorm:"index" json:"parent_comment_id,omitempty"`
	UserID          uint      `gorm:"not null;index" json:"user_id"`
	Content         string    `gorm:"type:text;not null" json:"content"`
	CreatedAt       time.Time `json:"created_at"`
}

func (Comment) TableName() string {
	return "comments"
}

func (c *Comment) ToResponse() Comment {
	return Comment{
		ID:              c.ID,
		PostID:          c.PostID,
		ParentCommentID: c.ParentCommentID,
		UserID:          c.UserID,
		Content:         c.Content,
		CreatedAt:       c.CreatedAt,
	}
}