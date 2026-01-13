package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type RepostHandler struct {
	repostService *services.RepostService
}

func NewRepostHandler(repostService *services.RepostService) *RepostHandler {
	return &RepostHandler{
		repostService: repostService,
	}
}

func (h *RepostHandler) ToggleRepost(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	
	var request struct {
		PostID     uint   `json:"post_id" binding:"required"`
		Visibility string `json:"visibility" binding:"required"` // public, friends or private
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID and visibility are required"})
		return
	}

	isReposted, err := h.repostService.ToggleRepost(userID.(uint), request.PostID, request.Visibility)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"reposted": isReposted,
		"message": func() string {
			if isReposted {
				return "Reposted successfully"
			}
			return "Unreposted successfully"
		}(),
	})
}

func (h *RepostHandler) GetRepostStatus(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	postIDStr := c.Query("post_id")
	if postIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}

	postID, err := strconv.ParseUint(postIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	isReposted, err := h.repostService.GetRepostStatus(userID.(uint), uint(postID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"reposted": isReposted,
	})
}

func (h *RepostHandler) GetReposters(c *gin.Context) {
	postIDStr := c.Query("post_id")
	limitStr := c.DefaultQuery("limit", utils.GetLimitStr())
	offsetStr := c.DefaultQuery("offset", utils.GetOffsetStr())

	if postIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}

	postID, err := strconv.ParseUint(postIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit, err = strconv.Atoi(utils.GetLimitStr())
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset, err = strconv.Atoi(utils.GetOffsetStr())
	}

	usernames, err := h.repostService.GetReposters(uint(postID), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// get total count
	totalCount, err := h.repostService.GetRepostCount(uint(postID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"reposters": usernames,
		"total":     totalCount,
		"limit":     limit,
		"offset":    offset,
	})
}

func (h *RepostHandler) GetUserReposts(c *gin.Context) {
	userIDStr := c.Query("user_id")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	limitStr := c.DefaultQuery("limit", utils.GetLimitStr())
	offsetStr := c.DefaultQuery("offset", utils.GetOffsetStr())

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit, err = strconv.Atoi(utils.GetLimitStr())
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset, err = strconv.Atoi(utils.GetOffsetStr())
	}	

	posts, err := h.repostService.GetUserReposts(uint(userID), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"posts":  posts,
		"limit":  limit,
		"offset": offset,
	})
}

func (h *RepostHandler) UpdateRepostVisibility(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var request struct {
		PostID     uint   `json:"post_id" binding:"required"`
		Visibility string `json:"visibility" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID and visibility are required"})
		return
	}

	err := h.repostService.UpdateRepostVisibility(userID.(uint), request.PostID, request.Visibility)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Visibility updated successfully",
	})
}