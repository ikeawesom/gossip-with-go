package services

import (
	"errors"
	"fmt"
	"gossip-with-go/internal/models"

	"gorm.io/gorm"
)

type RepostService struct {
	DB *gorm.DB
}

func NewRepostService(db *gorm.DB) *RepostService {
	return &RepostService{DB: db}
}

func (s *RepostService) ToggleRepost(userID uint, postID uint, visibility string) (bool, error) {
	// validate visibility
	if visibility != "public" && visibility != "friends" && visibility != "private" {
		return false, errors.New("visibility must be 'public', 'friends', or 'private'")
	}

	// check if repost already exists
	var existingRepost models.Repost
	result := s.DB.Where("user_id = ? AND post_id = ?", userID, postID).
		First(&existingRepost)

	// if repost exists, delete it (unrepost)
	if result.Error == nil {
		if err := s.DB.Delete(&existingRepost).Error; err != nil {
			return false, fmt.Errorf("failed to unrepost: %w", err)
		}

		// decrement the repost count on the post
		if err := s.decrementRepostCount(postID); err != nil {
			return false, fmt.Errorf("failed to decrement repost count: %w", err)
		}

		return false, nil // false = unreposted
	}

	// if repost doesn't exist, create it
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		newRepost := models.Repost{
			UserID:     userID,
			PostID:     postID,
			Visibility: visibility,
		}

		if err := s.DB.Create(&newRepost).Error; err != nil {
			return false, fmt.Errorf("failed to create repost: %w", err)
		}

		// increment the repost count on the post
		if err := s.incrementRepostCount(postID); err != nil {
			return false, fmt.Errorf("failed to increment repost count: %w", err)
		}

		return true, nil // true = reposted
	}

	return false, fmt.Errorf("database error: %w", result.Error)
}

func (s *RepostService) incrementRepostCount(postID uint) error {
	return s.DB.Table("posts").
		Where("id = ?", postID).
		Update("repost_count", gorm.Expr("repost_count + ?", 1)).
		Error
}

func (s *RepostService) decrementRepostCount(postID uint) error {
	return s.DB.Table("posts").
		Where("id = ? AND repost_count > 0", postID).
		Update("repost_count", gorm.Expr("repost_count - ?", 1)).
		Error
}

func (s *RepostService) GetRepostStatus(userID uint, postID uint) (bool, error) {
	var count int64
	
	err := s.DB.Model(&models.Repost{}).
		Where("user_id = ? AND post_id = ?", userID, postID).
		Count(&count).
		Error
	
	return count > 0, err
}

func (s *RepostService) GetReposters(postID uint, limit int, offset int) ([]string, error) {
	var usernames []string
	
	err := s.DB.Table("reposts").
		Select("users.username").
		Joins("JOIN users ON users.id = reposts.user_id").
		Where("reposts.post_id = ?", postID).
		Order("reposts.created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&usernames).
		Error
	
	return usernames, err
}

func (s *RepostService) GetRepostCount(postID uint) (int64, error) {
	var count int64
	
	err := s.DB.Model(&models.Repost{}).
		Where("post_id = ?", postID).
		Count(&count).
		Error
	
	return count, err
}

func (s *RepostService) GetUserReposts(userID uint, limit int, offset int) ([]models.Post, error) {
	var posts []models.Post
	
	err := s.DB.Table("posts").
		Select("posts.*").
		Joins("JOIN reposts ON reposts.post_id = posts.id").
		Where("reposts.user_id = ?", userID).
		Order("reposts.created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&posts).
		Error
	
	return posts, err
}

func (s *RepostService) UpdateRepostVisibility(userID uint, postID uint, visibility string) error {
	// validate visibility
	if visibility != "public" && visibility != "friends" && visibility != "private" {
		return errors.New("visibility must be 'public', 'friends', or 'private'")
	}

	result := s.DB.Model(&models.Repost{}).
		Where("user_id = ? AND post_id = ?", userID, postID).
		Update("visibility", visibility)

	if result.Error != nil {
		return fmt.Errorf("failed to update visibility: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return errors.New("repost not found")
	}

	return nil
}