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
				Joins("JOIN users ON user_id = posts.user_id").
				Where("topic = ?", topic).Find(&posts).Error; err != nil {
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
	if err := s.DB.Where("id = ? AND user_id = ?", postID, user.ID).First(&post).Error; err != nil {
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

	log.Println("created post obj", newPost)
	if err := s.DB.Create(&newPost).Error; err != nil {
		return err
	}

	return nil
}