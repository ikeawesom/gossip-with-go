package services

import (
	"errors"
	"fmt"
	"gossip-with-go/internal/models"

	"gorm.io/gorm"
)

type LikeService struct {
	DB *gorm.DB
}

func NewLikeService(db *gorm.DB) *LikeService {
	return &LikeService{DB: db}
}

func (s *LikeService) ToggleLike(userID uint, likeableType string, likeableID uint) (bool, error) {
	// validate likeable_type
	if likeableType != "post" && likeableType != "comment" {
		return false, errors.New("likeable_type must be 'post' or 'comment'")
	}

	// check if like already exists
	var existingLike models.Like
	result := s.DB.Where("user_id = ? AND likeable_type = ? AND likeable_id = ?", 
		userID, likeableType, likeableID).
		First(&existingLike)

	// if like exists, delete it (unlike)
	if result.Error == nil {
		if err := s.DB.Delete(&existingLike).Error; err != nil {
			return true, fmt.Errorf("failed to unlike: %w", err)
		}

		// decrement the like count on the post/comment
		if err := s.decrementLikeCount(likeableType, likeableID); err != nil {
			return true, fmt.Errorf("failed to decrement like count: %w", err)
		}

		return false, nil // false = unliked
	}

	// if like doesn't exist, create it
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		newLike := models.Like{
			UserID:       userID,
			LikeableType: likeableType,
			LikeableID:   likeableID,
		}

		if err := s.DB.Create(&newLike).Error; err != nil {
			return false, fmt.Errorf("failed to create like: %w", err)
		}

		// increment the like count on the target
		if err := s.incrementLikeCount(likeableType, likeableID); err != nil {
			return false, fmt.Errorf("failed to increment like count: %w", err)
		}

		return true, nil // true = liked
	}

	return false, fmt.Errorf("database error: %w", result.Error)
}

func (s *LikeService) incrementLikeCount(likeableType string, likeableID uint) error {
	var table string
	
	switch likeableType {
	case "post":
		table = "posts"
	case "comment":
		table = "comments"
	default:
		return errors.New("invalid likeable_type")
	}

	return s.DB.Table(table).
		Where("id = ?", likeableID).
		Update("like_count", gorm.Expr("like_count + ?", 1)).
		Error
}

func (s *LikeService) decrementLikeCount(likeableType string, likeableID uint) error {
	var table string
	
	switch likeableType {
	case "post":
		table = "posts"
	case "comment":
		table = "comments"
	default:
		return errors.New("invalid likeable_type")
	}

	return s.DB.Table(table).
		Where("id = ? AND like_count > 0", likeableID).
		Update("like_count", gorm.Expr("like_count - ?", 1)).
		Error
}

func (s *LikeService) GetLikeStatus(userID uint, likeableType string, likeableID uint) (bool, error) {
	var count int64
	
	err := s.DB.Model(&models.Like{}).
		Where("user_id = ? AND likeable_type = ? AND likeable_id = ?", 
			userID, likeableType, likeableID).
		Count(&count).
		Error
	
	return count > 0, err
}

func (s *LikeService) GetLikers(likeableType string, likeableID uint, limit int, offset int) ([]string, error) {
	var usernames []string
	
	err := s.DB.Table("likes").
		Select("users.username").
		Joins("JOIN users ON users.id = likes.user_id").
		Where("likes.likeable_type = ? AND likes.likeable_id = ?", likeableType, likeableID).
		Order("likes.created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&usernames).
		Error
	
	return usernames, err
}

func (s *LikeService) GetLikeCount(likeableType string, likeableID uint) (int64, error) {
	var count int64
	
	err := s.DB.Model(&models.Like{}).
		Where("likeable_type = ? AND likeable_id = ?", likeableType, likeableID).
		Count(&count).
		Error
	
	return count, err
}