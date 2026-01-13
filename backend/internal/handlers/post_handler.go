package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PostHandler struct {
	PostService *services.PostService
}

func NewPostHandler(postService *services.PostService) *PostHandler {
	return &PostHandler{
		PostService: postService,
	}
}

type GetPostByUsernameRequest struct {
	Username string `json:"username" binding:"required"`
}

type EditPostRequest struct {
    Title   string `json:"title" binding:"required"`
    Content string `json:"content" binding:"required"`
    Topic   uint `json:"topic" binding:"required"`
}

type CreatePostRequest struct {
	EditPostRequest
	Username string `json:"username" binding:"required"`
}

func (h *PostHandler) GetPostsByUsername(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	req := GetPostByUsernameRequest{
		Username: c.Param("username"),
	}

	posts, err := h.PostService.GetPostByUsername(req.Username, userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Posts retrieved successfully", gin.H{"posts": posts})
}

func (h *PostHandler) GetPostsByTopic(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	topicStr := c.Param("topic")

	topicID, err := strconv.Atoi(topicStr)
	if err != nil || topicID <= 0 {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid topic ID parameter", nil)
		return
	}

	posts, err := h.PostService.GetPostByTopic(topicID, userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Posts retrieved successfully", gin.H{"posts": posts})
}

func (h *PostHandler) GetUserPostByID(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	username := c.Param("username")
	postIDParam := c.Param("postID")

	postID, err := utils.ParseUintParam(postIDParam)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid post ID", nil)	
		return
	}
	
	post, err := h.PostService.GetUserPostByID(username, postID, userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.DebugLog("post", post)

	utils.SuccessResponse(c, http.StatusOK, "Post retrieved successfully", gin.H{"post": post})
}

func (h *PostHandler) GetTrendingPosts(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	limitStr := c.DefaultQuery("limit", utils.GetLimitStr()) 
	cursorStr := c.Query("cursor")              // empty string if not provided

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid limit parameter", nil)
		return
	}

	var cursor uint
	if cursorStr != "" {
		cursorUint64, err := strconv.ParseUint(cursorStr, 10, 32)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid cursor parameter", nil)
			return
		}
		cursor = uint(cursorUint64)
	}

	params := services.PaginationParams{
		Limit:  limit,
		Cursor: cursor,
		UserID: userID,
	}

	result, err := h.PostService.GetTrendingPosts(params)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch posts", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Posts retrieved successfully", result)
}

func (h *PostHandler) GetFollowingPosts(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	limitStr := c.DefaultQuery("limit", utils.GetLimitStr()) 
	cursorStr := c.Query("cursor")              // empty string if not provided

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid limit parameter", nil)
		return
	}

	var cursor uint
	if cursorStr != "" {
		cursorUint64, err := strconv.ParseUint(cursorStr, 10, 32)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid cursor parameter", nil)
			return
		}
		cursor = uint(cursorUint64)
	}

	params := services.PaginationParams{
		Limit:  limit,
		Cursor: cursor,
		UserID: userID,
	}

	result, err := h.PostService.GetFollowingPosts(params)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch posts", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Posts retrieved successfully", result)
}

func (h *PostHandler) CreatePost(c *gin.Context) {
	_, exists := c.Get("username")
    if !exists {
        utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
        return
    }

	var req CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	postID, err := h.PostService.CreatePost(req.Username, req.Title, req.Content, uint(req.Topic))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Post created successfully", gin.H{ "data" : postID })
}

func (h *PostHandler) EditPost(c *gin.Context) {
    postIDStr := c.Param("postID")
    postID, err := strconv.ParseUint(postIDStr, 10, 32)
    if err != nil {
        utils.ErrorResponse(c, http.StatusBadRequest, "Invalid post ID", nil)
        return
    }

    var req EditPostRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        utils.ValidationErrorResponse(c, err.Error())
        return
    }

    username, exists := c.Get("username")
    if !exists {
        utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
        return
    }

    err = h.PostService.EditPost(uint(postID), username.(string), req.Title, req.Content, req.Topic)
    if err != nil {
        if err.Error() == "post not found" {
            utils.ErrorResponse(c, http.StatusNotFound, err.Error(), nil)
            return
        }
        if err.Error() == "unauthorized to edit this post" {
            utils.ErrorResponse(c, http.StatusForbidden, err.Error(), nil)
            return
        }
        utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
        return
    }

    utils.SuccessResponse(c, http.StatusOK, "Post updated successfully", nil)
}

func (h *PostHandler) DeletePost(c *gin.Context) {
	postIDStr := c.Param("postID")
    postID, err := strconv.ParseUint(postIDStr, 10, 32)
    if err != nil {
        utils.ErrorResponse(c, http.StatusBadRequest, "Invalid post ID", nil)
        return
    }

    username, exists := c.Get("username")
    if !exists {
        utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
        return
    }

	err = h.PostService.DeletePost(uint(postID), username.(string))
    if err != nil {
        if err.Error() == "post not found" {
            utils.ErrorResponse(c, http.StatusNotFound, err.Error(), nil)
            return
        }
        if err.Error() == "unauthorized to delete this post" {
            utils.ErrorResponse(c, http.StatusForbidden, err.Error(), nil)
            return
        }
        utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
        return
    }

    utils.SuccessResponse(c, http.StatusOK, "Post deleted successfully", nil)

}