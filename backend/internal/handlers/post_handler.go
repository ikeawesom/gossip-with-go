package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"log"
	"net/http"

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

	log.Println("posts:",posts)
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


func (h *PostHandler) CreatePost(c *gin.Context) {
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