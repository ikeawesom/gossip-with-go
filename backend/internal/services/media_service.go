package services

import (
	"gossip-with-go/internal/models"

	"gorm.io/gorm"
)

type MediaService struct {
	DB *gorm.DB
}

func NewMediaService(db *gorm.DB) *MediaService {
	return &MediaService{DB: db}
}

func (s *MediaService) UploadMedia(mediaURL string, userID uint, postID uint) error {
	media := models.Media{
		Url: mediaURL,
		PostID: postID,
		UserID: userID,
	}

	return s.DB.Create(&media).Error	
}