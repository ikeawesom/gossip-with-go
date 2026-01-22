package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// init handlers
type LikeHandler struct {
	likeService *services.LikeService
}

func NewLikeHandler(likeService *services.LikeService) *LikeHandler {
	return &LikeHandler{
		likeService: likeService,
	}
}

// POST /likes/toggle
func (h *LikeHandler) ToggleLike(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// temporary struct for request
	var request struct {
		TargetID     uint   `json:"target_id" binding:"required"` // post or comment ID
		Type string `json:"type" binding:"required"` // post or comment
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID and Type are required"})
		return
	}

	isLiked, err := h.likeService.ToggleLike(userID.(uint), request.Type, request.TargetID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"liked": isLiked,
		"message": func() string {
			if isLiked {
				return "Liked successfully"
			}
			return "Unliked successfully"
		}(),
	})
}

// GET /likes/status
func (h *LikeHandler) GetLikeStatus(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	likeableType := c.Query("type")     // "post" or "comment"
	likeableIDStr := c.Query("id")      // the post or comment ID

	// validate parameters
	if likeableType == "" || likeableIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Type and ID are required"})
		return
	}

	likeableID, err := strconv.ParseUint(likeableIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	isLiked, err := h.likeService.GetLikeStatus(userID.(uint), likeableType, uint(likeableID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"liked": isLiked,
	})
}

// GET /likes/likers
func (h *LikeHandler) GetLikers(c *gin.Context) {
	// extract query params from context URL
	likeableType := c.Query("type")     // "post" or "comment"
	likeableIDStr := c.Query("id")      // the post or comment ID
	limitStr := c.DefaultQuery("limit", utils.GetLimitStr())
	offsetStr := c.DefaultQuery("offset", utils.GetOffsetStr()) 

	// validate parameters
	if likeableType == "" || likeableIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Type and ID are required"})
		return
	}

	likeableID, err := strconv.ParseUint(likeableIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// fallback to default limit
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit, err = strconv.Atoi(utils.GetLimitStr())
	}

	// fallback to default offset
	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset, err = strconv.Atoi(utils.GetOffsetStr())
	}

	usernames, err := h.likeService.GetLikers(likeableType, uint(likeableID), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalCount, err := h.likeService.GetLikeCount(likeableType, uint(likeableID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"likers": usernames,
		"total":  totalCount,
		"limit":  limit,
		"offset": offset,
	})
}

// POST /likes/by_type/:userID/:likeableType
func (h *LikeHandler) GetLikesByUserID(c *gin.Context) {
	currentUser, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	};

	currentUserID := currentUser.(uint)

	targetIDStr := c.Param("userID");
	
	targetID_temp, err := strconv.ParseUint(targetIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	targetID := uint(targetID_temp)
	
	// only target user can check their own likes
	if targetID != currentUserID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	//  get like type and validate
	likeable_type := c.Param("likeable_type")
	if likeable_type != "comments" && likeable_type != "posts" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "likeable type is either posts or comments"})
		return
	}
	
	if likeable_type == "posts" {
		// get likes on posts
		posts, err := h.likeService.GetPostLikesByUserID(targetID)
		
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{ "data": posts })
	} else {
		// get likes on comments
		comments, err := h.likeService.GetCommentsLikedByUserID(targetID)
		
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{ "data": comments })
	}
}