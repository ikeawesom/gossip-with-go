package handlers

import (
	"context"
	"gossip-with-go/internal/cloudinary"
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
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

	 // read normal form fields
    targetIDStr := c.PostForm("id")
    username := c.PostForm("username")
	log.Println("Username:", targetIDStr)
    bio := c.PostForm("bio")

	if targetIDStr == "" || username == "" || bio == "" {
        utils.ErrorResponse(c, http.StatusBadRequest, "id, username and bio are required", nil)
        return
    }

	targetID, _ := strconv.ParseUint(targetIDStr, 10, 64)

	if uint(targetID) != currentUserID.(uint) {
        utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
        return
    }

	file, avatarErr := c.FormFile("avatar")
	var avatarURL *string = nil
	const maxAvatarSize = 5 << 20 // 5MB

	if avatarErr == nil {
		// file must be under 5MB (save storage space for project)
		if file.Size > maxAvatarSize {
			utils.ErrorResponse(c, 400, "Image must be under 5MB", nil)
			return
		}
		
        // open file
        opened, _ := file.Open()
        defer opened.Close()

		buff := make([]byte, 512)
		opened.Read(buff)

		fileType := http.DetectContentType(buff)

		if !strings.HasPrefix(fileType, "image/") {
			utils.ErrorResponse(c, 400, "Only image files are allowed", nil)
			return
		}

		// open file
        opened_second, _ := file.Open()
        defer opened_second.Close()
		
        // upload to cloudinary
        upload, err := cloudinary.Cloudinary.Upload.Upload(
            context.Background(),
            opened_second,
            uploader.UploadParams{
                Folder: "avatars",
                Transformation: "c_fill,w_512,h_512,g_face", // square, face crop
            },
        )

        if err != nil {
            utils.ErrorResponse(c, http.StatusInternalServerError, "Avatar upload failed", nil)
            return
        }

        avatarURL = &upload.SecureURL
    }

	err := h.UserService.EditProfile(uint(targetID), username, bio, avatarURL);
	
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
