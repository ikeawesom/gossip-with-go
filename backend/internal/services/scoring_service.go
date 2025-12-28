package services

import (
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

func CalculatePostScore(post *PostWithUsername) float64 {
	// calculate engagement score
	engagementScore := float64(post.LikeCount)* LIKE_WEIGHT +
		float64(post.CommentCount)*COMMENT_WEIGHT +
		float64(post.RepostCount)*REPOST_WEIGHT +
		float64(post.ViewCount)*VIEW_WEIGHT

	ageInHours := time.Since(post.CreatedAt).Hours()

	// calculate time decay
	timeDecay := math.Pow(ageInHours + 2, GRAVITY) // to prevent issues with very new posts (division by 0)

	// calculate final score
	score := engagementScore / timeDecay

	return score
}

func CalculatePostScores(posts []PostWithUsername) []PostWithUsername {
	for i := range posts {
		posts[i].Score = CalculatePostScore(&posts[i])
	}
	return posts
}