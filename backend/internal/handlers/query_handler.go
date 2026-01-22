package handlers

import (
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// init handler
type QueryHandler struct {
	QueryService *services.QueryService
}

func NewQueryHandler(queryService *services.QueryService) *QueryHandler {
	return &QueryHandler{
		QueryService: queryService,
	}
}

// declare search req struct
type SearchRequest struct {
	Query     string
	QueryType string
}

// GET /query
func (h *QueryHandler) GetResultsByType(c *gin.Context) {
	req := SearchRequest{
		Query:     c.Query("value"),
		QueryType: c.Query("type"),
	}

	var (
		results interface{}
		err     error
	)

	// switch case to switch between query types
	switch req.QueryType {
		case "users":
			results, err = h.QueryService.QueryUsers(req.Query)
		case "posts":
			results, err = h.QueryService.QueryPosts(req.Query)
		case "topics":
			results, err = h.QueryService.QueryTopics(req.Query)
		default:
			// fallback error if query type is invalid
			utils.ErrorResponse(
				c,
				http.StatusBadRequest,
				"invalid query type",
				nil,
			)
			return
	}

	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(
		c,
		http.StatusOK,
		"Results retrieved successfully",
		gin.H{"results": results},
	)
}