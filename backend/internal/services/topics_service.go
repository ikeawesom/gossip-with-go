package services

import (
	"errors"
	"gossip-with-go/internal/models"
	"gossip-with-go/internal/utils"
	"log"
	"sort"
	"time"

	"gorm.io/gorm"
)

type TopicsService struct {
	DB *gorm.DB
}

type TopicsWithUsername struct {
	models.Topic

	Username string `json:"username"`

	UserHasFollowed bool     `gorm:"-" json:"user_has_followed"`
	Followers 		[]string `gorm:"-" json:"followers"`
}

type TopicWithScore struct {
	TopicsWithUsername

	RecentPostCount  int    `gorm:"-" json:"recent_post_count,omitempty"`
	Score            float64 `gorm:"-" json:"score,omitempty"`
}

func NewTopicService(db *gorm.DB) *TopicsService {
	return &TopicsService{
		DB: db,
	}
}

func (s *TopicsService) GetTopicByID(currentUser uint, topicID uint) (*TopicsWithUsername, error) {
	var topic TopicsWithUsername
	if err := s.DB.Table("topics").
				Select("topics.*, users.username").
				Joins("JOIN users ON topics.created_by = users.id").
				Where("topics.id = ?", topicID).
				First(&topic).Error; err != nil {
		return nil, err
	}

	// enrich topic with follow information
	if err := s.enrichTopicFollowers(&topic, currentUser); err != nil {
		return nil, err
	}
	
	return &topic, nil
}

func (s *TopicsService) CreateTopic(currentUser uint, topicTitle, topicDesc, topicClass string) (*models.Topic, error) {
	// check if name already exists
	var topic models.Topic
	if err := s.DB.Where("name = ?", topicTitle).First(&topic).Error; err == nil {
		// topic name has been taken
		return nil, err
	}

	// create new topic
	newTopic := models.Topic{
		TopicName: topicTitle,
		Description: topicDesc,
		TopicClass: topicClass,
		CreatedBy: currentUser,
	}

	if err := s.DB.Create(&newTopic).Error; err != nil {
		return nil, err
	}

	utils.DebugLog("new topic:", newTopic)

	return &newTopic, nil
}

func (s* TopicsService) DeleteTopics(currentUser uint, topicID uint) error {
	var user models.User
    if err := s.DB.Where("id = ?", currentUser).First(&user).Error; err != nil {
        return errors.New("user not found")
    }

    var topic models.Topic
    if err := s.DB.First(&topic, topicID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return errors.New("topic not found")
        }
        return err
    }

    // check if user owns the topic
    if topic.CreatedBy != user.ID {
        return errors.New("unauthorized to delete this topic")
    }

	// delete topic
	if err := s.DB.Delete(&topic).Error; err != nil {
		return err
	}

	return nil
}

func (s *TopicsService) enrichTopicFollowers(topic *TopicsWithUsername, currentUser uint) error {
	topicID := topic.ID

	// check if current user follows this topic
	if currentUser > 0 {
		var count int64
		s.DB.Table("follows").
			Where("follower_id = ? AND following_id = ? AND follow_type = ?", currentUser, topicID, "topic").
			Count(&count)
		topic.UserHasFollowed = count > 0
	}

	// get topic followers (top 3 most recent)
	type Result struct {
		Username string
	}

	var followers []Result
	s.DB.Table("follows").
		Select("users.username").
		Joins("JOIN users ON users.id = follows.follower_id").
		Where("follows.following_id = ? AND follow_type = ?", topicID, "topic").
		Order("follows.created_at DESC").
		Limit(3).
		Scan(&followers)

	topic.Followers = make([]string, len(followers))
	for i, f := range followers {
		topic.Followers[i] = f.Username
	}

	return nil
}

func (s *TopicsService) GetTrendingTopics() (*[]TopicWithScore, error) {
	// Calculate the timestamp for recent activity (last 7 days)
	recentThreshold := time.Now().AddDate(0, 0, -RECENT_DAYS_THRESHOLD)

	query := s.DB.
		Table("topics").
		Select(`
			topics.*,
			users.username,
			COALESCE(COUNT(DISTINCT CASE 
				WHEN posts.created_at >= ? 
				THEN posts.id 
			END), 0) as recent_post_count
		`, recentThreshold).
		Joins("JOIN users ON topics.created_by = users.id").
		Joins("LEFT JOIN posts ON posts.topic = topics.id").
		Group("topics.id, users.username")


	var topics []TopicWithScore
	if err := query.
		Order("topics.created_at DESC").
		Limit(6).
		Find(&topics).Error; err != nil {
		return nil, err
	}

	log.Println("[SERVICE] Fetched topics...")

	// Calculate scores and sort
	topics = CalculateTopicScores(topics)
	sortTopicsByScore(topics)

	return &topics, nil
}

func sortTopicsByScore(topics []TopicWithScore) {
	sort.Slice(topics, func(i, j int) bool {
		return topics[i].Score > topics[j].Score
	})
}