package services

import (
	"errors"
	"fmt"
	"gossip-with-go/internal/models"

	"gorm.io/gorm"
)

type CommentService struct {
	DB *gorm.DB
}

func NewCommentService(db *gorm.DB) *CommentService {
	return &CommentService{DB: db}
}

// creates a comment directly on a post
func (s *CommentService) CreateRootComment(userID uint, postID uint, content string) (*models.Comment, error) {
	if content == "" {
		return nil, errors.New("comment content cannot be empty")
	}

	comment := models.Comment{
		PostID:          postID,
		ParentCommentID: nil, // root comment
		UserID:          userID,
		Content:         content,
		LikeCount:       0,
	}

	if err := s.DB.Create(&comment).Error; err != nil {
		return nil, fmt.Errorf("failed to create comment: %w", err)
	}

	// increment the comment count on the post
	if err := s.incrementPostCommentCount(postID); err != nil {
		return nil, fmt.Errorf("failed to increment comment count: %w", err)
	}

	return &comment, nil
}

// creates a reply to an existing comment
func (s *CommentService) CreateReply(userID uint, parentCommentID uint, content string) (*models.Comment, error) {
	if content == "" {
		return nil, errors.New("reply content cannot be empty")
	}

	// check if parent comment exists and is a root comment (2 level comment nesting)
	var parentComment models.Comment
	if err := s.DB.First(&parentComment, parentCommentID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("parent comment not found")
		}
		return nil, fmt.Errorf("failed to find parent comment: %w", err)
	}

	// cannot reply to a reply
	if parentComment.ParentCommentID != nil {
		return nil, errors.New("cannot reply to a reply, only root comments can have replies")
	}

	// create the reply
	reply := models.Comment{
		PostID:          parentComment.PostID, // inherit the post ID from parent
		ParentCommentID: &parentCommentID,   
		UserID:          userID,
		Content:         content,
		LikeCount:       0,
	}

	if err := s.DB.Create(&reply).Error; err != nil {
		return nil, fmt.Errorf("failed to create reply: %w", err)
	}

	// increment the comment count on the post
	if err := s.incrementPostCommentCount(parentComment.PostID); err != nil {
		return nil, fmt.Errorf("failed to increment comment count: %w", err)
	}

	return &reply, nil
}

func (s *CommentService) incrementPostCommentCount(postID uint) error {
	return s.DB.Table("posts").
		Where("id = ?", postID).
		Update("comment_count", gorm.Expr("comment_count + ?", 1)).
		Error
}

// retrieves all root comments for a post (paginated)
func (s *CommentService) GetRootCommentsByPostID(postID uint, limit int, offset int) ([]models.Comment, error) {
	var comments []models.Comment
	
	err := s.DB.Where("post_id = ? AND parent_comment_id IS NULL", postID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&comments).
		Error
	
	return comments, err
}

// retrieves all replies for a specific comment (paginated)
func (s *CommentService) GetRepliesByCommentID(commentID uint, limit int, offset int) ([]models.Comment, error) {
	var replies []models.Comment
	
	err := s.DB.Where("parent_comment_id = ?", commentID).
		Order("created_at ASC").
		Limit(limit).
		Offset(offset).
		Find(&replies).
		Error
	
	return replies, err
}

func (s *CommentService) GetCommentByID(commentID uint) (*models.Comment, error) {
	var comment models.Comment
	
	err := s.DB.First(&comment, commentID).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("comment not found")
		}
		return nil, fmt.Errorf("failed to get comment: %w", err)
	}
	
	return &comment, nil
}

func (s *CommentService) UpdateComment(commentID uint, userID uint, newContent string) error {
	if newContent == "" {
		return errors.New("comment content cannot be empty")
	}

	// check if comment exists and belongs to the user
	var comment models.Comment
	if err := s.DB.First(&comment, commentID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("comment not found")
		}
		return fmt.Errorf("failed to find comment: %w", err)
	}

	// check ownership
	if comment.UserID != userID {
		return errors.New("you can only edit your own comments")
	}

	// update the comment
	result := s.DB.Model(&comment).Update("content", newContent)
	if result.Error != nil {
		return fmt.Errorf("failed to update comment: %w", result.Error)
	}

	return nil
}

func (s *CommentService) DeleteComment(commentID uint, userID uint) error {
	// check if comment exists and belongs to the user
	var comment models.Comment
	if err := s.DB.First(&comment, commentID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("comment not found")
		}
		return fmt.Errorf("failed to find comment: %w", err)
	}

	// check ownership
	if comment.UserID != userID {
		return errors.New("you can only delete your own comments")
	}

	if err := s.DB.Delete(&comment).Error; err != nil {
		return fmt.Errorf("failed to delete comment: %w", err)
	}

	// decrement the comment count on the post
	if err := s.decrementPostCommentCount(comment.PostID); err != nil {
		return fmt.Errorf("failed to decrement comment count: %w", err)
	}

	return nil
}

func (s *CommentService) decrementPostCommentCount(postID uint) error {
	return s.DB.Table("posts").
		Where("id = ? AND comment_count > 0", postID).
		Update("comment_count", gorm.Expr("comment_count - ?", 1)).
		Error
}

func (s *CommentService) GetCommentCount(postID uint) (int64, error) {
	var count int64
	
	err := s.DB.Model(&models.Comment{}).
		Where("post_id = ?", postID).
		Count(&count).
		Error
	
	return count, err
}

func (s *CommentService) GetReplyCount(commentID uint) (int64, error) {
	var count int64
	
	err := s.DB.Model(&models.Comment{}).
		Where("parent_comment_id = ?", commentID).
		Count(&count).
		Error
	
	return count, err
}