package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
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

func (h* UserHandler) EditProfile(c *gin.Context) {
	currentUserID, exists := c.Get("userID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var request struct {
		TargetID uint    `json:"id" binding:"required"`
		Username  string  `json:"username" binding:"required"`
		Bio  string  `json:"bio" binding:"required"`
	}

	if reqErr := c.ShouldBindJSON(&request); reqErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "TargetID, username and bio are required"})
		return
	}

	if currentUserID != request.TargetID {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	err := h.UserService.EditProfile(request.TargetID, request.Username, request.Bio);
    if err != nil {
        if err.Error() == "user not found" {
            utils.ErrorResponse(c, http.StatusNotFound, err.Error(), nil)
            return
        }
        if err.Error() == "unauthorized to edit this profile" {
            utils.ErrorResponse(c, http.StatusForbidden, err.Error(), nil)
            return
        }
        utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
        return
    }

	utils.SuccessResponse(c, http.StatusOK, "User updated successfully", nil)
}

func (h *UserHandler) GetUserByUsername(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	req := services.GetUserByUsernameParams{
		Username: c.Param("username"),
		CurrentUserID: userID,
	}

	user, err := h.UserService.GetUserByUsername(req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error(), nil)
		
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", gin.H{"user": user})
}

func (h *UserHandler) GetFollowersByUsername(c *gin.Context) {
	req := services.GetUserRequest{
		Username: c.Param("username"),
	}

	user, err := h.UserService.GetUserFollowers(req.Username)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error(), nil)
		
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", gin.H{"user": user})
}

func (h *UserHandler) GetFollowingsByUsername(c *gin.Context) {
	req := services.GetUserRequest{
		Username: c.Param("username"),
	}

	user, err := h.UserService.GetUserFollowings(req.Username)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error(), nil)
		
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", gin.H{"user": user})
}
