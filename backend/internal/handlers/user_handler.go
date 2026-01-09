package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{
		UserService: userService,
	}
}



func (h *UserHandler) GetUserByUsername(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	log.Printf("[HANDLER] UserID: %s", userID)

	req := services.GetUserByUsernameParams{
		Username: c.Param("username"),
		CurrentUserID: userID,
	}

	log.Printf("searching for %s", req.Username)

	user, err := h.UserService.GetUserByUsername(req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", gin.H{"user": user})
}

func (h *UserHandler) GetFollowersByUsername(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	log.Printf("[HANDLER] UserID: %s", userID)

	req := services.GetUserRequest{
		Username: c.Param("username"),
	}

	log.Printf("searching for %s", req.Username)

	user, err := h.UserService.GetUserFollowers(req.Username)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", gin.H{"user": user})
}

func (h *UserHandler) GetFollowingsByUsername(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	log.Printf("[HANDLER] UserID: %s", userID)

	req := services.GetUserRequest{
		Username: c.Param("username"),
	}

	log.Printf("searching for %s", req.Username)

	user, err := h.UserService.GetUserFollowings(req.Username)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", gin.H{"user": user})
}
