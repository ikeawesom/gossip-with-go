package services

import (
	"log"

	"gossip-with-go/internal/models"
)

// BUZZ ALGORITHM PSEUDOCODE
// buzz_score = (post likes × 2) + (comment likes × 1) + (reposts × 3)

// buzz scoring weights
const (
	PostLikeWeight    = 2 // post likes are worth 2 points
	CommentLikeWeight = 1 // comment likes are worth 1 point
	RepostWeight      = 3 // reposts are worth 3 points
)

func (s *UserService) CalculateUserBuzz(userID uint) int {
	// get all post IDs created by this user
	var postIDs []uint
	s.DB.Model(&models.Post{}).
		Where("user_id = ?", userID).
		Pluck("id", &postIDs)

	// count likes on those posts
	var postLikes int64
	if len(postIDs) > 0 {
		s.DB.Model(&models.Like{}).
			Where("likeable_type = ? AND likeable_id IN ?", "post", postIDs).
			Count(&postLikes)
	}

	// count reposts of those posts
	var reposts int64
	if len(postIDs) > 0 {
		s.DB.Model(&models.Repost{}).
			Where("post_id IN ?", postIDs).
			Count(&reposts)
	}

	// get all comment IDs created by this user
	var commentIDs []uint
	s.DB.Model(&models.Comment{}).
		Where("user_id = ?", userID).
		Pluck("id", &commentIDs)

	// count likes on those comments
	var commentLikes int64
	if len(commentIDs) > 0 {
		s.DB.Model(&models.Like{}).
			Where("likeable_type = ? AND likeable_id IN ?", "comment", commentIDs).
			Count(&commentLikes)
	}

	// calculate weighted buzz
	postBuzz := int(postLikes) * PostLikeWeight
	commentBuzz := int(commentLikes) * CommentLikeWeight
	repostBuzz := int(reposts) * RepostWeight
	totalBuzz := postBuzz + commentBuzz + repostBuzz
	
	log.Printf("User %d buzz breakdown: (%d post likes × %d) + (%d comment likes × %d) + (%d reposts × %d) = %d total",
		userID, postLikes, PostLikeWeight, commentLikes, CommentLikeWeight, reposts, RepostWeight, totalBuzz)

	return totalBuzz
}