package services

import (
	"errors"
	"gossip-with-go/internal/models"
	"log"

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