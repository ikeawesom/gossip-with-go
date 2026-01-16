package services

import (
	"gossip-with-go/internal/models"
	"math"
	"time"
)

// SCORING ALGORITHM PSEUDOCODE
// engagementScore = (likes × 1.0) + (comments × 2.5) + (reposts × 3.0) + (views × 0.01)
// timeDecay = (ageInHours + 2) ^ 1.8
// finalScore = engagementScore / timeDecay

// to determine how much each engagement type matters
const (
	LIKE_WEIGHT    = 1.0
	COMMENT_WEIGHT = 2.5  // comments are more valuable than likes
	REPOST_WEIGHT  = 3.0  // reposts show strongest engagement
	VIEW_WEIGHT    = 0.01 // views matter but much less
	GRAVITY        = 1.8  // controls how fast old posts decay
)

func CalculatePostScore(post *models.Post) float64 {
	// calculate engagement score
	engagementScore := float64(post.LikeCount)* LIKE_WEIGHT +
		float64(post.CommentCount)*COMMENT_WEIGHT +
		float64(post.RepostCount)*REPOST_WEIGHT +
		float64(post.ViewCount)*VIEW_WEIGHT

	ageInHours := time.Since(post.CreatedAt).Hours()

	if ageInHours < 0 {
		ageInHours = 0
	}
	
	// to prevent issues with very new posts (division by 0)
	decayBase := ageInHours + 2
	if decayBase <= 0 {
		decayBase = 2
	}

	// calculate time decay
	timeDecay := math.Pow(decayBase, GRAVITY)

	// calculate final score with safety
	score := engagementScore / timeDecay
	if math.IsNaN(score) || math.IsInf(score, 0) {
		score = 0
	}

	return score
}

func CalculatePostScores(posts []models.Post) []models.Post {
	for i := range posts {
		posts[i].Score = CalculatePostScore(&posts[i])
	}
	return posts
}

// TOPIC SCORING ALGORITHM PSEUDOCODE
// engagementScore = (followers × 2.0) + (posts × 1.5) + (recent_activity × 3.0)
// timeDecay = (ageInDays + 7) ^ 1.5
// finalScore = engagementScore / timeDecay

const (
	TOPIC_FOLLOWER_WEIGHT      = 2.0  // followers show sustained interest
	TOPIC_POST_WEIGHT          = 1.5  // posts show activity level
	TOPIC_RECENT_ACTIVITY_WEIGHT = 3.0  // recent posts matter most
	TOPIC_GRAVITY              = 1.5  // slower decay than posts (topics are more stable)
	RECENT_DAYS_THRESHOLD      = 7    // consider posts from last 7 days as "recent"
)

func CalculateTopicScore(topic *TopicWithScore) float64 {
	// calculate engagement score
	engagementScore := float64(topic.FollowerCount)*TOPIC_FOLLOWER_WEIGHT +
		float64(topic.PostCount)*TOPIC_POST_WEIGHT +
		float64(topic.RecentPostCount)*TOPIC_RECENT_ACTIVITY_WEIGHT

	// calculate age in days (topics decay slower than posts)
	ageInDays := time.Since(topic.CreatedAt).Hours() / 24
	if ageInDays < 0 {
		ageInDays = 0
	}

	// prevent division issues with very new topics
	decayBase := ageInDays + 7 // add 7 days to prevent harsh penalty for new topics
	if decayBase <= 0 {
		decayBase = 7
	}

	// calculate time decay (slower than posts)
	timeDecay := math.Pow(decayBase, TOPIC_GRAVITY)

	// calculate final score with safety
	score := engagementScore / timeDecay
	if math.IsNaN(score) || math.IsInf(score, 0) {
		score = 0
	}

	return score
}

func CalculateTopicScores(topics []TopicWithScore) []TopicWithScore {
	for i := range topics {
		topics[i].Score = CalculateTopicScore(&topics[i])
	}
	return topics
}