package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"mime/multipart"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// init handlers
type PostHandler struct {
	PostService *services.PostService
}

func NewPostHandler(postService *services.PostService) *PostHandler {
	return &PostHandler{
		PostService: postService,
	}
}

// declare request struct types
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

// GET /posts/users/:username
func (h *PostHandler) GetPostsByUsername(c *gin.Context) {
	// optional auth for interactions
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

// GET /posts/topic/:topic
func (h *PostHandler) GetPostsByTopic(c *gin.Context) {
	// optional auth for interactions
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

// GET /posts/users/:username/:postID
func (h *PostHandler) GetUserPostByID(c *gin.Context) {
	// optional auth for interactions
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

	utils.SuccessResponse(c, http.StatusOK, "Post retrieved successfully", gin.H{"post": post})
}

// GET /posts/trending
func (h *PostHandler) GetTrendingPosts(c *gin.Context) {
	// optional auth for interactions
	var userID uint = 0
	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	// fallback to default limit and cursor for pagination
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

// GET /posts/following
func (h *PostHandler) GetFollowingPosts(c *gin.Context) {
	// optional auth for interactions and posts
	var userID uint = 0
	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	// fallback to default limit and cursor for pagination
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

// POST /posts/create
func (h *PostHandler) CreatePost(c *gin.Context) {
	_, exists := c.Get("username")
    if !exists {
        utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
        return
    }

	// read normal for fields
	title := c.PostForm("title")
	content := c.PostForm("content")
	username := c.PostForm("username")
	topicStr := c.PostForm("topic")
	imgNoStr := c.PostForm("image_no")

	if title == "" || username == "" || content == "" || topicStr == "" || imgNoStr == "" {
        utils.ErrorResponse(c, http.StatusBadRequest, "title, username, content, image_no and topic are required", nil)
        return
    }

	topic, _ := strconv.ParseUint(topicStr, 10, 64)
	imgNo, _:= strconv.ParseUint(imgNoStr, 10, 64)
	
	// create empty array for image files
	var imgFiles []*multipart.FileHeader = make([]*multipart.FileHeader, imgNo)

	// add each file to the array declared
	for i := range imgNo {
		i_str := strconv.FormatUint(i, 10)
		
		// frontend naming convention image_[image_index]
		imageName := "image_" + i_str
		
		file, imgErr := c.FormFile(imageName)
		if imgErr == nil {
			imgFiles[i] = file
		}
	}

	postID, err := h.PostService.CreatePost(username, title, content, uint(topic), imgFiles)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Post created successfully", gin.H{"data":postID})
}

// POST /posts/edit
func (h *PostHandler) EditPost(c *gin.Context) {
    postIDStr := c.PostForm("postID")
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

	// read normal for fields
	title := c.PostForm("title")
	content := c.PostForm("content")

    err = h.PostService.EditPost(uint(postID), username.(string), title, content)
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

// POST /posts/delete/:postID
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