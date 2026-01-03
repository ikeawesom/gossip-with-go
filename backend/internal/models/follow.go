package models

import "time"

type Follow struct {
	ID          uint      `gorm:"primaryKey"`

	FollowType  string    `gorm:"not null;index:uniqueIndex:idx_follower_following"`
	FollowerID  uint      `gorm:"not null;index;uniqueIndex:idx_follower_following"`
	FollowingID uint      `gorm:"not null;index;uniqueIndex:idx_follower_following"`
	
	CreatedAt   time.Time
}

func (Follow) TableName() string {
	return "follows"
}

type UserFollowResponse struct {
    ID             uint   `json:"id"`
	FollowingID    uint   `json:"following_id"`
    Username       string `json:"username"`
    IsFriend       bool   `json:"is_friend"`
}