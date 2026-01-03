package models

import "time"

type Topic struct {
    ID          uint      `gorm:"primaryKey" json:"id"`
    TopicName        string    `gorm:"not null" json:"topic_name"`
    Description string    `gorm:"not null" json:"description,omitempty"`
    TopicClass   string    `gorm:"not null" json:"topic_class"`
    
    // User details
    CreatedBy   uint      `json:"createdBy"`
    
    PostCount   int       `gorm:"default:0;not null" json:"post_count"`
    FollowerCount int       `gorm:"default:0;not null" json:"follower_count"`
    
    CreatedAt   time.Time `json:"createdAt"`
    UpdatedAt   time.Time `json:"updated_at"`
}


func (Topic) TableName() string {
	return "topics"
}