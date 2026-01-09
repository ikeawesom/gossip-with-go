package services

import (
	"errors"
	"gossip-with-go/internal/models"
	"gossip-with-go/internal/utils"

	"gorm.io/gorm"
)

type QueryService struct {
	DB *gorm.DB
}

func NewQueryService(db *gorm.DB) *QueryService {
	return &QueryService{
		DB: db,
	}
}

type Query struct {
	query string
}

type QueryUserResponse struct {
	UserID uint `json:"id"`
	Username string `json:"username"`
}

type QueryTopicResponse struct {
	TopicID uint `json:"id"`
	TopicTitle string `json:"title"`
}
type QueryPostResponse struct {
	models.Post
	Username string `json:"username"`
}

func (s *QueryService) QueryUsers(searchQuery string) ([]QueryUserResponse, error) {
	var users []QueryUserResponse
	updatedSearch := "%" + searchQuery + "%"
	if err := s.DB.
		Table("users").
		Select("users.id, users.username").
		Where("username ILIKE ?", updatedSearch).Find(&users).Error;
		
		err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("no results found")
		}
		return nil, err
	}
	return users, nil
}

func (s *QueryService) QueryTopics(searchQuery string) ([]TopicsWithUsername, error) {
	var topics []TopicsWithUsername
	updatedSearch := "%" + searchQuery + "%"

	if err := s.DB.Table("topics").
			Select("topics.*, users.username").
			Joins("JOIN users ON topics.created_by = users.id").
			Where("topics.topic_name ILIKE ? OR topics.description ILIKE ?", updatedSearch, updatedSearch).
			Order("follower_count DESC").
			Find(&topics).Error;

			err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return nil, errors.New("no results found")
				}
				return nil, err
			}

	utils.DebugLog("Topics Result:", topics)
	return topics, nil
}

func (s *QueryService) QueryPosts(searchQuery string) ([]QueryPostResponse, error) {
	var posts []QueryPostResponse
	updatedSearch := "%" + searchQuery + "%"

	if err := s.DB.
		Table("posts").
		Select("posts.*, users.username").
		Joins("JOIN users ON users.id = posts.user_id").
		Where("title ILIKE ? OR content ILIKE ? OR users.username ILIKE ?", updatedSearch, updatedSearch, updatedSearch).
		Order("like_count DESC").
		Find(&posts).Error;
		
		err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("no results found")
		}
		return nil, err
	}
	return posts, nil
}