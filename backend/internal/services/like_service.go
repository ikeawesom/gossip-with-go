package services

import (
	"errors"
	"fmt"
	"gossip-with-go/internal/models"
	"time"

	"gorm.io/gorm"
)

// init services
type LikeService struct {
	DB *gorm.DB
}

func NewLikeService(db *gorm.DB) *LikeService {
	return &LikeService{DB: db}
}

type LikedComments struct {
	CommentID         uint      `json:"comment_id"`
	Content           string    `json:"content"`

	CommenterUsername string    `json:"commenter_username"`
	CommenterPfp      string    `json:"commenter_pfp"`
	PostID            uint      `json:"post_id"`
	PosterUsername    string    `json:"poster_username"`
	CommentCreatedAt  time.Time `json:"comment_created_at"`
	LikedAt           time.Time `json:"liked_at"`
}

func (s *LikeService) GetCommentsLikedByUserID(userID uint) ([]LikedComments, error) {
	var comments []LikedComments

	// using complex DISTINCT ON query to fetch latest
	// updates of likes and comments due to soft deletes
	err := s.DB.
		Table("likes").
		Select(`DISTINCT ON (comments.id)
				comments.id as comment_id,
				comments.content as content,
				commenter.username as commenter_username,
				commenter.pfp as commenter_pfp,
				comments.post_id,
				poster.username as poster_username,
				comments.created_at as comment_created_at,
				likes.created_at as liked_at`).
		Joins("JOIN comments ON likes.likeable_id = comments.id").
		Joins("JOIN users as commenter ON comments.user_id = commenter.id").
		Joins("JOIN posts ON comments.post_id = posts.id").
		Joins("JOIN users as poster ON posts.user_id = poster.id").
		Where("likes.user_id = ? AND likes.likeable_type = ?", userID, "comment").
		Where("likes.deleted_at IS NULL AND comments.deleted_at IS NULL AND posts.deleted_at IS NULL").
		Order("comments.id, likes.created_at DESC").
		Find(&comments).
		Error

	if err != nil {
		return nil, err
	}

	return comments, nil
}

func (s *LikeService) GetPostLikesByUserID(userID uint) ([]PostWithTopic, error) {
	var posts []PostWithTopic

	err := s.DB.
			Table("likes").
			Select("posts.*, users.username, users.pfp").
			Joins("JOIN posts ON likes.likeable_id = posts.id").
			Joins("JOIN users ON posts.user_id = users.id").
			Where("likes.user_id = ? AND likeable_type = ?", userID, "post").
			Where("posts.deleted_at IS NULL").
			Find(&posts).
			Error

	if err != nil {
		return nil, err
	}

	return posts, nil
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
	
	// switch case to determine likeable type
	switch likeableType {
	case "post":
		table = "posts"
	case "comment":
		table = "comments"
	default:
		// fallback if likeable type is invalid
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
		Select("users.username, users.pfp").
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