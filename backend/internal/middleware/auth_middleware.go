package middleware

import (
	"net/http"

	"gossip-with-go/internal/config"
	"gossip-with-go/internal/utils"

	"github.com/gin-gonic/gin"
)

// middleware validates JWT token from cookie
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// get access token from cookie
		accessToken, err := c.Cookie("access_token")
		if err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized - No token provided", nil)
			c.Abort()
			return
		}

		// validate token
		cfg := config.AppConfig
		claims, err := utils.ValidateToken(accessToken, cfg.JWTSecret)
		if err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized - Invalid token", nil)
			c.Abort()
			return
		}

		// check token type
		if claims.Type != utils.AccessToken {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized - Invalid token type", nil)
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("username", claims.Username)

		c.Next()
	}
}

func AuthOptional() gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken, err := c.Cookie("access_token")
		if err != nil {
			c.Next() // do not crash if not authorised
			return
		}

		cfg := config.AppConfig
		claims, err := utils.ValidateToken(accessToken, cfg.JWTSecret)
		if err != nil || claims.Type != utils.AccessToken {
			c.Next()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("username", claims.Username)

		c.Next()
	}
}