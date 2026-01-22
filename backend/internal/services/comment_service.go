package services

import (
	"errors"
	"fmt"
	"gossip-with-go/internal/models"
	"time"

	"gorm.io/gorm"
)

// init services
type CommentService struct {
	DB *gorm.DB
}

func NewCommentService(db *gorm.DB) *CommentService {
	return &CommentService{DB: db}
}

// declare struct types
type CommentWithUsername struct {
	models.Comment
	Username string `json:"username"`
	Pfp string 		`json:"pfp"`

	UserHasLiked bool     `gorm:"-" json:"user_has_liked"`
}

type UserComments struct {
	CommentID         uint      `json:"comment_id"`
	Content           string    `json:"content"`

	CommenterUsername string    `json:"commenter_username"`
	CommenterPfp      string    `json:"commenter_pfp"`

	PostID            uint      `json:"post_id"`
	PosterUsername    string    `json:"poster_username"`
	PostTitle         string    `json:"post_title"`
	
	CommentCreatedAt  time.Time `json:"comment_created_at"`
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

// retrieves all comments made by user
func (s *CommentService) GetCommentsByUserID(userID uint) ([]UserComments, error) {
	var comments []UserComments

	// using complex DISTINCT ON query to fetch latest
	// updates of comments due to soft deletes
	err := s.DB.
		Table("comments").
		Select(`
			DISTINCT ON (comments.id)
			comments.id        as comment_id,
			comments.content   as content,
			commenter.username as commenter_username,
			commenter.pfp 	   as commenter_pfp,
			comments.post_id,
			poster.username    as poster_username,
			posts.title        as post_title,
			comments.created_at as comment_created_at
		`).
		Joins("JOIN users as commenter ON comments.user_id = commenter.id").
		Joins("JOIN posts ON comments.post_id = posts.id").
		Joins("JOIN users as poster ON posts.user_id = poster.id").
		Where("comments.user_id = ?", userID).
		Where("comments.deleted_at IS NULL").
		Where("posts.deleted_at IS NULL").
		Order("comments.id, comments.created_at DESC").
		Find(&comments).
		Error

	if err != nil {
		return nil, err
	}

	return comments, nil
}


// retrieves all root comments for a post (paginated)
func (s *CommentService) GetRootCommentsByPostID(postID uint, limit int, offset int, currentUser uint) ([]CommentWithUsername, error) {
	var comments []CommentWithUsername
	
	err := s.DB.
		Table("comments").
		Select("comments.*, users.username, users.pfp").
		Joins("JOIN users ON users.id = comments.user_id").
		Where("post_id = ? AND parent_comment_id IS NULL", postID).
		Order("is_pinned DESC").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&comments).
		Error

	// only enrich if user is authenticated
	if currentUser > 0 {
		if err := s.encrichWithInteractionData(comments, currentUser); err != nil {
			return nil, err
		}
	}
	
	return comments, err
}

func (s *CommentService) encrichWithInteractionData(comments []CommentWithUsername, currentUserID uint) error {
	if len(comments) == 0 {
		return nil
	}

	commentIDs := make([]uint, len(comments))
	for i, post := range comments {
		commentIDs[i] = post.ID
	}

	// get current user's likes in ONE query
	var userLikes []models.Like
	if currentUserID > 0 {
		s.DB.Where("user_id = ? AND likeable_type = ? AND likeable_id IN ?", 
			currentUserID, "comment", commentIDs).
			Find(&userLikes)
	}

	// use map for fast lookup
	userLikesMap := make(map[uint]bool)
	for _, like := range userLikes {
		userLikesMap[like.LikeableID] = true
	}

	// populate comment fields
	for i := range comments {
		commentID := comments[i].ID
		comments[i].UserHasLiked = userLikesMap[commentID] // set to user liked
	}

	return nil
}

// retrieves all replies for a specific comment (paginated)
func (s *CommentService) GetRepliesByCommentID(commentID uint, limit int, offset int, currentUser uint) ([]CommentWithUsername, error) {
	var replies []CommentWithUsername

	err := s.DB.
		Table("comments").
		Select("comments.*, users.username, users.pfp").
		Joins("JOIN users ON users.id = comments.user_id").
		Where("parent_comment_id = ?", commentID).
		Order("created_at ASC").
		Limit(limit).
		Offset(offset).
		Find(&replies).
		Error

	// only enrich if user is authenticated
	if currentUser > 0 {
		if err := s.encrichWithInteractionData(replies, currentUser); err != nil {
			return nil, err
		}
	}
	
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

func (s *CommentService) TogglePin(commentID uint, userID uint) error {

	// check if comment exists
	var comment models.Comment
	if err := s.DB.First(&comment, commentID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("comment not found")
		}
		return fmt.Errorf("failed to find comment: %w", err)
	}

	// pin the comment
	result := s.DB.Model(&comment).Update("is_pinned", !comment.IsPinned)
	if result.Error != nil {
		return fmt.Errorf("failed to toggle pin: %w", result.Error)
	}

	return nil
}

func (s *CommentService) DeleteComment(commentID uint, userID uint) error {
	// check if comment exists
	var comment models.Comment
	if err := s.DB.First(&comment, commentID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("comment not found")
		}
		return fmt.Errorf("failed to find comment: %w", err)
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

// helper function for decrementing
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