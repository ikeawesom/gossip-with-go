package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TopicHandler struct {
	TopicService *services.TopicsService
}

func NewTopicHandler(topicService *services.TopicsService) *TopicHandler {
	return &TopicHandler{
		TopicService: topicService,
	}
}

func (h* TopicHandler) GetTopicByID(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	topicIDstr := c.Param("topicID")
    topicID, err := strconv.ParseUint(topicIDstr, 10, 32)
    if err != nil {
        utils.ErrorResponse(c, http.StatusBadRequest, "Invalid post ID", nil)
        return
    }

	topic, err := h.TopicService.GetTopicByID(userID, uint(topicID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Topic fetched successfully", gin.H{"topic": topic})
}

func (h* TopicHandler) CreateTopic(c *gin.Context) {
	userID, exists := c.Get("userID");
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
        return
	}

	var request struct {
		TopicName string `json:"title" binding:"required"`
		TopicDesc string `json:"desc" binding:"required"`
		TopicClass string `json:"className" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Topic Title, Desc and Class Name are required"})
		return
	}

	topic, err := h.TopicService.CreateTopic(userID.(uint), request.TopicName, request.TopicDesc, request.TopicClass)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.DebugLog("[HANLDER]:", topic)

	utils.SuccessResponse(c, http.StatusOK, "Topic created successfully", gin.H{"topic": topic})
}

func (h *TopicHandler) DeletePost(c *gin.Context) {
	userID, exists := c.Get("userID");
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated", nil)
        return
	}

	topicIDstr := c.Param("topicID")
    topicID, err := strconv.ParseUint(topicIDstr, 10, 32)
    if err != nil {
        utils.ErrorResponse(c, http.StatusBadRequest, "Invalid post ID", nil)
        return
    }

	err = h.TopicService.DeleteTopics(userID.(uint), uint(topicID))

    if err != nil {
        
        if err.Error() == "post not found" {
            utils.ErrorResponse(c, http.StatusNotFound, err.Error(), nil)
            return
        }
        if err.Error() == "unauthorized to delete this topic" {
            utils.ErrorResponse(c, http.StatusForbidden, err.Error(), nil)
            return
        }
        utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
        return
    }

    utils.SuccessResponse(c, http.StatusOK, "topic deleted successfully", nil)

}

func (h *TopicHandler) GetTrendingTopics(c *gin.Context) {
	topics, err := h.TopicService.GetTrendingTopics()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch trending topics", nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Trending topics fetched successfully", gin.H{ "topics": topics })
}