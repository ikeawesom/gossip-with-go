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

type GetUserByUsernameRequest struct {
	Username string `json:"username" binding:"required"`
}

func (h *UserHandler) GetUserByUsername(c *gin.Context) {
	req := GetUserByUsernameRequest{
		Username: c.Param("username"),
	}

	log.Printf("searching for %s", req.Username)

	user, err := h.UserService.GetUserByUsername(req.Username)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error(), nil)
		log.Println(err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", gin.H{"user": user})
}