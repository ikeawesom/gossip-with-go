package services

import (
	"errors"
	"fmt"
	"gossip-with-go/internal/models"

	"gorm.io/gorm"
)

type FollowService struct {
	DB *gorm.DB
}

func NewFollowService(db *gorm.DB) *FollowService {
	return &FollowService{DB: db}
}

func (s *FollowService) ToggleFollow(followingID uint, currentUser uint) (bool, error) {
	// check if current user already follows
	var exisitingFollow models.Follow
	result := s.DB.Where("following_id = ? AND follower_id = ?", followingID, currentUser).First(&exisitingFollow)

	// follow exists, delete it (unfollow)
	if result.Error == nil {
		if err := s.DB.Delete(&exisitingFollow).Error;
		err != nil {
			return true, fmt.Errorf("failed to unfollow")
		}

		// decrement follower count on user
		if err := s.decrementFollowerCount(followingID); err != nil {
			return true, fmt.Errorf("failed to decrement follower count: %w", err)
		}

		// decrement following count on current user
		if err := s.decrementFollowingCount(currentUser); err != nil {
			return true, fmt.Errorf("failed to decrement following count: %w", err)
		}

		return false, nil
	}

	// if follow does not exist, create it
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		newFollow := models.Follow{
			FollowerID: currentUser,
			FollowingID: followingID,
		}

		if err := s.DB.Create(&newFollow).Error; err != nil {
			return false, fmt.Errorf("failed to follow")
		}

		// increment follower count
		if err := s.incrementFollowerCount(followingID); err != nil {
			return false, fmt.Errorf("failed to increment follower count: %w", err)
		}

		// increment following count on current user
		if err := s.incrementFollowingCount(currentUser); err != nil {
			return false, fmt.Errorf("failed to increment following count: %w", err)
		}

		return true, nil
	}

	return false, fmt.Errorf("database error: %w", result.Error)
}

func (s *FollowService) decrementFollowerCount(userID uint) error {
	return s.DB.Table("users").
		Where("id = ? AND follower_count > 0", userID).
		Update("follower_count", gorm.Expr("follower_count - ?", 1)).
		Error
}

func (s *FollowService) decrementFollowingCount(userID uint) error {
	return s.DB.Table("users").
		Where("id = ? AND following_count > 0", userID).
		Update("following_count", gorm.Expr("following_count - ?", 1)).
		Error
}

func (s *FollowService) incrementFollowerCount(userID uint) error {
	return s.DB.Table("users").
		Where("id = ?", userID).
		Update("follower_count", gorm.Expr("follower_count + ?", 1)).
		Error
}

func (s *FollowService) incrementFollowingCount(userID uint) error {
	return s.DB.Table("users").
		Where("id = ?", userID).
		Update("following_count", gorm.Expr("following_count + ?", 1)).
		Error
}