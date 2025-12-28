package services

import (
	"errors"
	"gossip-with-go/internal/models"
	"log"
	"sort"

	"gorm.io/gorm"
)

type PostService struct {
	DB *gorm.DB
}

type NewPost struct {
	Username string
	Topic    string
	Title    string
	Content  string
}

type PaginationParams struct {
	Limit  int  
	Cursor uint
}

type PaginatedPostsResponse struct {
	Posts      []PostWithUsername `json:"posts"`
	NextCursor *uint         `json:"next_cursor"`
	HasMore    bool          `json:"has_more"`
}

type PostWithUsername struct {
	models.Post
	Username string `json:"username"`
}

func NewPostService(db *gorm.DB) *PostService {
	return &PostService{
		DB: db,
	}
}

func (s *PostService) GetPostByUsername(username string) ([]models.Post, error) {
	var user models.User
	if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	log.Printf("found user ID %d for username %s", user.ID, username)

	var posts []models.Post
	if err := s.DB.Where("user_id = ?", user.ID).Order("created_at DESC").Find(&posts).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("posts not found")
		}
		return nil, err
	}
	
	return posts, nil
}

func (s *PostService) GetPostByTopic(topic string) ([]PostWithUsername, error) {
	var posts []PostWithUsername
	if err := s.DB.
				Table("posts").
				Select("posts.id, posts.user_id, users.username, posts.topic, posts.title, posts.content, posts.created_at, posts.updated_at").
				Joins("JOIN users ON users.id = posts.user_id").
				Where("topic = ?", topic).
				Order("created_at DESC").
				Find(&posts).Error; err != nil {
					if errors.Is(err, gorm.ErrRecordNotFound) {
						return nil, errors.New("posts not found")
					}
					return nil, err
				}

	return posts, nil
}

func (s *PostService) GetUserPostByID(username string, postID uint) (*models.Post, error) {
	var user models.User
	if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	var post models.Post
	if err := s.DB.Where("id = ? AND user_id = ?", postID, user.ID).Order("created_at DESC").First(&post).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("post not found")
		}
		return nil, err
	}

	return &post, nil
}

func (s *PostService) CreatePost(username, topic, title, content string) error {
	// get userID of username
	var user models.User
	if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return err
	}

	log.Printf("found user ID %d for username %s", user.ID, username)
	
	// create post
	newPost := models.Post{
		UserID: user.ID,
		Topic: topic,
		Title: title,
		Content: content,
	}

	if err := s.DB.Create(&newPost).Error; err != nil {
		return err
	}

	return nil
}

func (s *PostService) EditPost(postID uint, username, topic, title, content string) error {
    var user models.User
    if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
        return errors.New("user not found")
    }

    log.Printf("found user ID %d for username %s", user.ID, username)

    var post models.Post
    if err := s.DB.First(&post, postID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return errors.New("post not found")
        }
        return err
    }

    // check if user owns the post
    if post.UserID != user.ID {
        return errors.New("unauthorized to edit this post")
    }

   // update post
    post.Topic = topic
    post.Title = title
    post.Content = content

    if err := s.DB.Save(&post).Error; err != nil {
        return err
    }

    log.Printf("successfully updated post %d", postID)
    return nil
}

func (s *PostService) DeletePost(postID uint, username string) error {
    var user models.User
    if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
        return errors.New("user not found")
    }

    log.Printf("found user ID %d for username %s", user.ID, username)

    var post models.Post
    if err := s.DB.First(&post, postID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return errors.New("post not found")
        }
        return err
    }

    // check if user owns the post
    if post.UserID != user.ID {
        return errors.New("unauthorized to delete this post")
    }

   // delete post
   if err := s.DB.Delete(&post).Error; err != nil {
        return err
    }

    log.Printf("successfully updated post %d", postID)
    return nil
}

func (s *PostService) GetTrendingPosts(params PaginationParams) (*PaginatedPostsResponse, error) {
	// validate parameters
	if params.Limit <= 0 {
		params.Limit = 10 // default to 10 posts per page
	}
	if params.Limit > 50 {
		params.Limit = 50 // maximum 50 posts per page
	}

	query := s.DB.
		Table("posts").
		Select("posts.id, posts.user_id, users.username, posts.topic, posts.title, posts.content, posts.like_count, posts.comment_count, posts.view_count, posts.repost_count, posts.created_at, posts.updated_at").
		Joins("JOIN users ON users.id = posts.user_id")

	if params.Cursor > 0 {
		query = query.Where("posts.id < ?", params.Cursor)
	}

	var posts []PostWithUsername
	if err := query.
		Order("posts.created_at DESC").
		Limit(params.Limit + 1). // fetch +1 to check if there are more posts
		Find(&posts).Error; err != nil {
		return nil, err
	}

	posts = CalculatePostScores(posts)
	sortPostsByScore(posts)

	// check if there are more posts (because of +1 earlier)
	hasMore := len(posts) > params.Limit
	if hasMore {
		posts = posts[:params.Limit] // trim to limit
	}

	// determine next cursor
	var nextCursor *uint
	if hasMore && len(posts) > 0 {
		lastPostID := posts[len(posts) - 1].ID // next cursor is the ID of the last post in this batch
		nextCursor = &lastPostID
	}

	return &PaginatedPostsResponse{
		Posts:      posts,
		NextCursor: nextCursor,
		HasMore:    hasMore,
	}, nil
}

func sortPostsByScore(posts []PostWithUsername) {
	sort.Slice(posts, func(i, j int) bool {
		return posts[i].Score > posts[j].Score
	})
}