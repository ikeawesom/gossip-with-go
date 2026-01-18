package models

import "time"

type Notification struct {
	ID uint `gorm:"primaryKey" json:"id"`

	EntityType string `gorm:"not null;index" json:"entity_type"` // follow, like_post, like_comment, root_comment, reply_comment, repost
	EntityID   uint   `gorm:"not null;index" json:"entity_id"`   // user_id, post_id, comment_id, comment_id, comment_id, post_id

	UserID  uint `gorm:"not null;index" json:"user_id"`  // the user that receives the notif
	ActorID uint `gorm:"not null;index" json:"actor_id"` // the user that interacted

	Viewed	bool `gorm:"default:false;not null" json:"viewed"`
	CreatedAt time.Time `json:"created_at"`
}

func (Notification) TableName() string {
	return "notifications"
}