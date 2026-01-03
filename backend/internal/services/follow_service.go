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

func (s *FollowService) ToggleFollow(followingID uint, followType string, currentUser uint) (bool, error) {
	// check if current user already follows
	var exisitingFollow models.Follow
	result := s.DB.Where("following_id = ? AND follower_id = ? AND follow_type = ?", followingID, currentUser, followType).First(&exisitingFollow)

	// follow exists, delete it (unfollow)
	if result.Error == nil {
		if err := s.DB.Delete(&exisitingFollow).Error;
		err != nil {
			return true, fmt.Errorf("failed to unfollow")
		}

		if followType == "user" {
			// decrement follower count on user
			if err := s.decrementFollowerCount(followingID, followType); err != nil {
				return true, fmt.Errorf("failed to decrement follower count: %w", err)
			}

			// decrement following count on current user
			if err := s.decrementFollowingCount(currentUser, followType); err != nil {
				return true, fmt.Errorf("failed to decrement following count: %w", err)
			}
		} else {
			// decrement follower count on topic
			if err := s.decrementFollowerCount(followingID, followType); err != nil {
				return true, fmt.Errorf("failed to decrement follower count: %w", err)
			}

			// // decrement following topic count on current user - TODO
			// if err := s.decrementFollowingCount(currentUser); err != nil {
			// 	return true, fmt.Errorf("failed to decrement following count: %w", err)
			// }
		}

		return false, nil
	}

	// if follow does not exist, create it
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		newFollow := models.Follow{
			FollowerID: currentUser,
			FollowingID: followingID,
			FollowType: followType,
		}

		if err := s.DB.Create(&newFollow).Error; err != nil {
			return false, fmt.Errorf("failed to follow")
		}

		if followType == "user" {
			// increment follower count
			if err := s.incrementFollowerCount(followingID, followType); err != nil {
				return false, fmt.Errorf("failed to increment follower count: %w", err)
			}

			// increment following count on current user
			if err := s.incrementFollowingCount(currentUser, followType); err != nil {
				return false, fmt.Errorf("failed to increment following count: %w", err)
			}
		} else {
			// increment follower count on topic
			if err := s.incrementFollowerCount(followingID, followType); err != nil {
				return false, fmt.Errorf("failed to increment follower count: %w", err)
			}
			// // increment following topic count on current user - TODO
			// if err := s.incrementFollowingCount(currentUser); err != nil {
			// 	return false, fmt.Errorf("failed to increment following count: %w", err)
			// }
		}
		

		return true, nil
	}

	return false, fmt.Errorf("database error: %w", result.Error)
}

func (s *FollowService) incrementFollowerCount(entityID uint, followType string) error {
	tableName := getFollowTableName(followType)
	return s.DB.Table(tableName).
		Where("id = ?", entityID).
		Update("follower_count", gorm.Expr("follower_count + ?", 1)).
		Error
}

func (s *FollowService) decrementFollowerCount(entityID uint, followType string) error {
	tableName := getFollowTableName(followType)
	return s.DB.Table(tableName).
		Where("id = ? AND follower_count > 0", entityID).
		Update("follower_count", gorm.Expr("follower_count - ?", 1)).
		Error
}

func (s *FollowService) incrementFollowingCount(entityID uint, followType string) error {
	tableName := getFollowTableName(followType)
	return s.DB.Table(tableName).
		Where("id = ?", entityID).
		Update("following_count", gorm.Expr("following_count + ?", 1)).
		Error
}

func (s *FollowService) decrementFollowingCount(entityID uint, followType string) error {
	tableName := getFollowTableName(followType)
	return s.DB.Table(tableName).
		Where("id = ? AND following_count > 0", entityID).
		Update("following_count", gorm.Expr("following_count - ?", 1)).
		Error
}

func getFollowTableName(followType string) string {
	if followType == "user" {
		return "users"
	} else {
		return "topics"
	}
}