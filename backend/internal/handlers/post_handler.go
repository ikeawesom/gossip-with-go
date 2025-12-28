package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"log"
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

type GetPostByTopicRequest struct {
	Topic string `json:"topic" binding:"required"`
}

type CreatePostRequest struct {
	Username string `json:"username" binding:"required"`
	Title    string `json:"title" binding:"required"`
	Content  string `json:"content" binding:"required"`
	Topic    string `json:"topic" binding:"required"`
}


type EditPostRequest struct {
    Title   string `json:"title" binding:"required"`
    Content string `json:"content" binding:"required"`
    Topic   string `json:"topic" binding:"required"`
}

type DeletePostRequest struct {
	PostID uint `json:"post_id" binding:"required"`
	UserID uint `json:"user_id" binding:"required"`
}

func (h *PostHandler) GetPostByUsername(c *gin.Context) {
	req := GetPostByUsernameRequest{
		Username: c.Param("username"),
	}

	log.Printf("searching for posts by %s", req.Username)

	posts, err := h.PostService.GetPostByUsername(req.Username)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		log.Println(err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Posts retrieved successfully", gin.H{"posts": posts})
}

func (h *PostHandler) GetPostByTopic(c *gin.Context) {
	req := GetPostByTopicRequest{
		Topic: c.Param("topic"),
	}

	log.Printf("searching for posts from %s", req.Topic)

	posts, err := h.PostService.GetPostByTopic(req.Topic)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		log.Println(err)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Posts retrieved successfully", gin.H{"posts": posts})
}

func (h *PostHandler) GetUserPostByID(c *gin.Context) {
	username := c.Param("username")
	postIDParam := c.Param("postID")
	log.Printf("searching for post ID %s by user %s", postIDParam, username)

	postID, err := utils.ParseUintParam(postIDParam)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid post ID", nil)	
		return
	}
	
	post, err := h.PostService.GetUserPostByID(username, postID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		log.Println(err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Post retrieved successfully", gin.H{"post": post})
}

func (h *PostHandler) GetTrendingPosts(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")  // default to 10
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
	}

	result, err := h.PostService.GetTrendingPosts(params)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch posts", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Posts retrieved successfully", result)
}

func (h *PostHandler) CreatePost(c *gin.Context) {
	username, exists := c.Get("username")
    if !exists {
        utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
		log.Print("User not authenticated")
        return
    }

	log.Printf("creating post for user %s", username.(string))

	var req CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}
	log.Printf("creating post for user %s", req.Username)

	err := h.PostService.CreatePost(req.Username, req.Topic, req.Title, req.Content)
	if err != nil {
		log.Println(err)
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Post created successfully", nil)
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
		log.Print("User not authenticated")
        return
    }

    log.Printf("editing post %d for user %s", postID, username.(string))

    err = h.PostService.EditPost(uint(postID), username.(string), req.Topic, req.Title, req.Content)
    if err != nil {
        log.Println(err)
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
		log.Print("User not authenticated")
        return
    }

    log.Printf("deleting post %d for user %s", postID, username.(string))

	err = h.PostService.DeletePost(uint(postID), username.(string))
    if err != nil {
        log.Println(err)
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