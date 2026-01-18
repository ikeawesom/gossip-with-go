package services

import (
	"gossip-with-go/internal/models"
	"time"

	"gorm.io/gorm"
)

type NotificationService struct {
	DB *gorm.DB
}

func NewNotificationService(db *gorm.DB) *NotificationService {
	return &NotificationService{DB: db}
}

type NotificationWithDetails struct {
	models.Notification

	ActorUsername    string `json:"actor_username"`
	ReceiverUsername string `json:"receiver_username"`

	// for comments and reply
	CommentContent  string  `json:"comment_content"`
	PostID		    uint    `json:"post_id"`

	// for posts
	PosterUsername  string  `json:"poster_username"`
	PostTitle		string 	`json:"post_title"`
	PostContent		string	`json:"post_content"`
}

func (s *NotificationService) GetUserNotifications(userID uint) ([]NotificationWithDetails, error) {
	var notifications []NotificationWithDetails

	twoWeeksAgo := time.Now().AddDate(0, 0, -14) // maximum notification display
	
	err := s.DB.
			Table("notifications").
			Select(`actor.username as actor_username,
					receiver.username as receiver_username,
					notifications.*`).
			Joins("JOIN users as actor ON notifications.actor_id = actor.id").
			Joins("JOIN users as receiver ON notifications.user_id = receiver.id").
			Where("notifications.user_id = ?", userID).
			Where("notifications.created_at >= ?", twoWeeksAgo).
			Order("created_at DESC").
			Find(&notifications).
			Error
	
	if err != nil {
		return nil, err;
	}
	
	postIDs := make([]uint, 0)
	commentIDs := make([]uint, 0)

	for _, n := range notifications {
		switch n.EntityType {
		case "like_post", "repost":
			postIDs = append(postIDs, n.EntityID)

		case "like_comment", "root_comment", "reply_comment":
			commentIDs = append(commentIDs, n.EntityID)
		}
	}

	type postDetails struct {
		ID             uint
		PosterUsername string
		Title          string
		Content        string
	}

	postsMap := make(map[uint]postDetails)

	// batch queries for efficiency
	if len(postIDs) > 0 {
		var posts []postDetails

		err := s.DB.
			Table("posts").
			Select(`
				posts.id,
				users.username AS poster_username,
				posts.title,
				posts.content
			`).
			Joins("JOIN users ON users.id = posts.user_id").
			Where("posts.id IN ?", postIDs).
			Find(&posts).
			Error
		if err != nil {
			return nil, err
		}

		for _, p := range posts {
			postsMap[p.ID] = p
		}
	}

	type commentDetails struct {
		ID             uint
		PostID         uint
		PosterUsername string
		Content        string
	}

	commentsMap := make(map[uint]commentDetails)
	
	// batch queries for efficiency
	if len(commentIDs) > 0 {
		var comments []commentDetails

		err := s.DB.
			Table("comments").
			Select(`
				comments.id,
				posts.id AS post_id,
				users.username AS poster_username,
				comments.content
			`).
			Joins("JOIN posts ON posts.id = comments.post_id").
			Joins("JOIN users ON users.id = posts.user_id").
			Where("comments.id IN ?", commentIDs).
			Find(&comments).
			Error
		if err != nil {
			return nil, err
		}

		for _, c := range comments {
			commentsMap[c.ID] = c
		}
	}

	for i := range notifications {
		notif := &notifications[i]

		switch notif.EntityType {
			case "like_post", "repost":
				if post, ok := postsMap[notif.EntityID]; ok {
					notif.PostID = post.ID
					notif.PosterUsername = post.PosterUsername
					notif.PostTitle = post.Title
					notif.PostContent = post.Content
				}

			case "like_comment", "root_comment", "reply_comment":
				if c, ok := commentsMap[notif.EntityID]; ok {
					notif.PostID = c.PostID
					notif.PosterUsername = c.PosterUsername
					notif.CommentContent = c.Content
				}
		}
	}

	return notifications, nil				
}

func (s *NotificationService) ToggleView(notifID uint) (bool, error) {
	var notification models.Notification
	if err := s.DB.Where("id = ?", notifID).First(&notification).Error; err != nil {
		return false, err
	}

	if err := s.DB.Table("notifications").Where("id = ?", notifID).Update("viewed", !notification.Viewed).Error; err != nil {
		return notification.Viewed, err
	}

	return !notification.Viewed, nil
}