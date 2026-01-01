package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FollowHandler struct {
	followService *services.FollowService
}

func NewFollowHandler(followService *services.FollowService) *FollowHandler {
	return &FollowHandler{
		followService: followService,
	}
}

// POST /api/follow/toggle
func (h *FollowHandler) ToggleFollow(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var request struct {
		FollowingID uint `json:"following_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Following ID required"})
		return
	}

	isFollow, err := h.followService.ToggleFollow(request.FollowingID, userID.(uint))
	if (err != nil) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"followed": isFollow,
		"message": func() string {
			if isFollow {
				return "Followed successfully"
			}
			return "Unfollowed successfully"
		}(),
	})
}