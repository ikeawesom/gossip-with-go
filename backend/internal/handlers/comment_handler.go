package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CommentHandler struct {
	commentService *services.CommentService
}

func NewCommentHandler(commentService *services.CommentService) *CommentHandler {
	return &CommentHandler{
		commentService: commentService,
	}
}

// POST /api/comments/root
func (h *CommentHandler) CreateRootComment(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var request struct {
		PostID  uint   `json:"post_id" binding:"required"`
		Content string `json:"content" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post ID and content are required"})
		return
	}

	comment, err := h.commentService.CreateRootComment(userID.(uint), request.PostID, request.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Comment created successfully",
		"comment": comment,
	})
}

// POST /api/comments/reply
func (h *CommentHandler) CreateReply(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var request struct {
		ParentCommentID uint   `json:"parent_comment_id" binding:"required"`
		Content         string `json:"content" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parent comment ID and content are required"})
		return
	}

	reply, err := h.commentService.CreateReply(userID.(uint), request.ParentCommentID, request.Content)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Reply created successfully",
		"reply":   reply,
	})
}

// GET /api/posts/:id/comments
func (h *CommentHandler) GetRootComments(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}

	postIDStr := c.Param("postID")
	postID, err := strconv.ParseUint(postIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	limitStr := c.DefaultQuery("limit", utils.GetLimitStr())
	offsetStr := c.DefaultQuery("offset", utils.GetOffsetStr())

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit, err = strconv.Atoi(utils.GetLimitStr())
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset, err = strconv.Atoi(utils.GetOffsetStr())
	}

	// get root comments
	comments, err := h.commentService.GetRootCommentsByPostID(uint(postID), limit, offset, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// get total comment count
	totalCount, err := h.commentService.GetCommentCount(uint(postID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// for each root comment, get the reply count
	type CommentWithReplyCount struct {
		services.CommentWithUsername
		ReplyCount int64 `json:"reply_count"`
	}

	commentsWithCounts := make([]CommentWithReplyCount, len(comments))
	for i, comment := range comments {
		replyCount, err := h.commentService.GetReplyCount(comment.ID)
		if err != nil {
			replyCount = 0 // default to 0
		}
		commentsWithCounts[i] = CommentWithReplyCount{
			CommentWithUsername:    comment,
			ReplyCount: replyCount,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"comments": commentsWithCounts,
		"total":    totalCount,
		"limit":    limit,
		"offset":   offset,
	})
}

// GET /api/comments/:id/replies
func (h *CommentHandler) GetReplies(c *gin.Context) {
	var userID uint = 0

	if v, exists := c.Get("userID"); exists {
		userID = v.(uint)
	}
	
	commentIDStr := c.Param("id")
	commentID, err := strconv.ParseUint(commentIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	limitStr := c.DefaultQuery("limit", utils.GetRepliesLimitStr())
	offsetStr := c.DefaultQuery("offset", utils.GetOffsetStr())

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit, err = strconv.Atoi(utils.GetRepliesLimitStr())
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset, err = strconv.Atoi(utils.GetOffsetStr())
	}

	// get replies
	replies, err := h.commentService.GetRepliesByCommentID(uint(commentID), limit, offset, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.DebugLog("Replies: ",replies)

	// get total reply count
	totalCount, err := h.commentService.GetReplyCount(uint(commentID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// calculate if there are more replies to load
	hasMore := (offset + limit) < int(totalCount)

	c.JSON(http.StatusOK, gin.H{
		"replies":  replies,
		"total":    totalCount,
		"limit":    limit,
		"offset":   offset,
		"has_more": hasMore,
	})
}

// POST /api/comments/:id
func (h *CommentHandler) UpdateComment(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	commentIDStr := c.Param("id")
	commentID, err := strconv.ParseUint(commentIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	var request struct {
		Content string `json:"content" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Content is required"})
		return
	}

	err = h.commentService.UpdateComment(uint(commentID), userID.(uint), request.Content)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment updated successfully",
	})
}

// DELETE /api/comments/:id
func (h *CommentHandler) DeleteComment(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	commentIDStr := c.Param("id")
	commentID, err := strconv.ParseUint(commentIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	err = h.commentService.DeleteComment(uint(commentID), userID.(uint))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment deleted successfully",
	})
}