package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// init handlers
type NotificationHandler struct {
	notificationService *services.NotificationService
}

func NewNotificationHandler(notificationService *services.NotificationService) *NotificationHandler {
	return &NotificationHandler{
		notificationService: notificationService,
	}
}

// GET /notifications/me
func (h *NotificationHandler) GetUserNotifications(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	notifications, err := h.notificationService.GetUserNotifications(userID.(uint))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Notifications retrieved successfully", gin.H{"notifications": notifications})
}

// POST /notifications/toggle-view/:notif_id
func (h *NotificationHandler) ToggleViewed(c *gin.Context) {
	_, exists := c.Get("userID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	notifIDStr := c.Param("notif_id")
	notifID, _ := strconv.ParseUint(notifIDStr, 10, 64)

	viewed, err := h.notificationService.ToggleView(uint(notifID))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Toggled notification view", gin.H{"viewed": viewed})
}

// POST /notifications/toggle-all-view
func (h *NotificationHandler) ToggleAllViewed(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	err := h.notificationService.ToggleAllView(userID.(uint))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Toggled all notification view", nil)
}