package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Errors  interface{} `json:"errors,omitempty"`
}

func GetLimitStr() string {
	return "10" // default to 10
}

func GetRepliesLimitStr() string {
	return "5" // default to 5
}

func GetOffsetStr() string {
	return "0" // default to 0
}

// sends a success response
func SuccessResponse(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// sends an error response
func ErrorResponse(c *gin.Context, statusCode int, message string, errors interface{}) {
	c.JSON(statusCode, Response{
		Success: false,
		Message: message,
		Errors:  errors,
	})
}

// sends validation error response
func ValidationErrorResponse(c *gin.Context, errors interface{}) {
	c.JSON(http.StatusBadRequest, Response{
		Success: false,
		Message: "Validation failed",
		Errors:  errors,
	})
}