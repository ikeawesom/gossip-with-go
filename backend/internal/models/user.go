package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Username  string         `gorm:"size:50;uniqueIndex;not null" json:"username"`
	Bio       string		 `json:"bio"`
	Email     string         `gorm:"size:320;uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"not null" json:"-"`
	Pfp       string        `gorm:"default:null" json:"pfp"`

	FollowerCount    int            `gorm:"default:0;not null" json:"follower_count"`
	FollowingCount    int            `gorm:"default:0;not null" json:"following_count"`
	
	EmailVerified      bool      `gorm:"default:false" json:"email_verified"`
	VerificationToken  *string   `gorm:"size:255;uniqueIndex" json:"-"`
	VerificationExpiry *time.Time `json:"-"`
	
	ResetToken  *string   `gorm:"size:255;uniqueIndex" json:"-"`
	ResetExpiry *time.Time `json:"-"`
	
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (User) TableName() string {
	return "users"
}

type UserResponse struct {
	ID            uint      `json:"id"`
	Username      string    `json:"username"`
	Email         string    `json:"email"`
	EmailVerified bool      `json:"email_verified"`
	CreatedAt     time.Time `json:"created_at"`
}

func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:            u.ID,
		Username:      u.Username,
		Email:         u.Email,
		EmailVerified: u.EmailVerified,
		CreatedAt:     u.CreatedAt,
	}
}