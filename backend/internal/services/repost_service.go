package services

import (
	"errors"
	"fmt"
	"gossip-with-go/internal/models"
	"gossip-with-go/internal/utils"
	"sort"
	"time"

	"gorm.io/gorm"
)

// init services
type RepostService struct {
	DB *gorm.DB
	PostService *PostService
}

func NewRepostService(db *gorm.DB, postService *PostService) *RepostService {
	return &RepostService{
		DB: db,
		PostService: postService,
	}
}

// declare struct types
type RepostedPosts struct {
	PostID      uint      `json:"post_id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	MediaURLs   []string  `gorm:"-" json:"media_urls"`
	
	PosterID    uint      `json:"poster_id"`
	Username    string    `json:"username"`
	Pfp         string    `json:"pfp"`

	TopicID     uint      `json:"topic_id"`
	TopicName   string    `json:"topic_name"`
	TopicClass  string    `json:"topic_class"`

	RepostedOn  time.Time `json:"reposted_on"`
	CreatedAt   time.Time `json:"created_at"`
}

type PostWithRepostedTime struct {
	PostWithTopic
	RepostCreatedAt time.Time `json:"repost_created_at"`
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

func (s *RepostService) GetUserReposts(userID uint, currentUser uint) ([]PostWithRepostedTime, error) {
var posts []PostWithTopic

	// get all valid reposts
	var reposts []models.Repost
	if err := s.DB.Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&reposts).Error; err != nil {
		return nil, err
	}
	
	// extract post IDs from reposts
	if len(reposts) == 0 {
		return []PostWithRepostedTime{}, nil
	}
	
	postIDs := make([]uint, len(reposts))
	for i, repost := range reposts {
		postIDs[i] = repost.PostID
	}
	
	// fetch the posts with all necessary joins
	err := s.DB.Table("posts").
		Select("posts.*, users.username, users.pfp, topics.topic_name as topic_name, topics.topic_class as topic_class").
		Joins("LEFT JOIN users ON users.id = posts.user_id").
		Joins("LEFT JOIN topics ON topics.id = posts.topic").
		Where("posts.id IN ?", postIDs).
		Find(&posts).Error
	
	if err != nil {
		return nil, err
	}

	// only enrich if user is authenticated - HERE]
	if (currentUser > 0) {
		if err := s.PostService.encrichWithInteractionData(posts, currentUser); err != nil {
			return nil, err
		}
	}

	// enrich with media on posts
	if err := s.PostService.enrichWithMedia(posts); err != nil {
		return nil, err
	}

	repostTimeMap := make(map[uint]time.Time)
	for _, repost := range reposts {
		repostTimeMap[repost.PostID] = repost.CreatedAt
	}

	// add repost timestamp to each post
	postsWithTime := make([]PostWithRepostedTime, len(posts))
	for i, post := range posts {
		postsWithTime[i] = PostWithRepostedTime{
			PostWithTopic: post,
			RepostCreatedAt: repostTimeMap[post.ID],
		}
	}

	// sort by the repost creation time
	sort.Slice(postsWithTime, func(i, j int) bool {
		return postsWithTime[i].RepostCreatedAt.After(postsWithTime[j].RepostCreatedAt)
	})

	utils.DebugLog("Reposted:", postsWithTime)
	
	return postsWithTime, nil
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

// helper functions to increment/decrement count
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