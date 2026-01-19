package middleware

import (
	"log"
	"net/http"

	"gossip-with-go/internal/config"
	"gossip-with-go/internal/utils"

	"github.com/gin-gonic/gin"
)

// middleware validates JWT token from cookie
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Log all cookies received
		log.Printf("[MIDDLEWARE] cookies received: %s", c.Request.Header.Get("Cookie"))
		log.Printf("[MIDDLEWARE] user-agent: %s", c.Request.Header.Get("User-Agent"))
		
		// get access token from cookie
		accessToken, err := c.Cookie("access_token")
		if err != nil {
			log.Printf("[MIDDLEWARE] no access_token cookie found: %v", err)
			utils.ErrorResponse(c, http.StatusUnauthorized, "Please sign in to use this function.", nil)
			c.Abort()
			return
		}

		log.Printf("[MIDDLEWARE] access token found: %s...", accessToken[:min(20, len(accessToken))])

		// validate token
		cfg := config.AppConfig
		claims, err := utils.ValidateToken(accessToken, cfg.JWTSecret)
		if err != nil {
			log.Printf("[MIDDLEWARE] token validation failed: %v", err)
			utils.ErrorResponse(c, http.StatusUnauthorized, "Please sign in to use this function.", nil)
			c.Abort()
			return
		}

		// check token type
		if claims.Type != utils.AccessToken {
			log.Printf("[MIDDLEWARE] wrong token type: %v", claims.Type)
			utils.ErrorResponse(c, http.StatusUnauthorized, "Please sign in to use this function.", nil)
			c.Abort()
			return
		}

		log.Printf("[MIDDLEWARE] user authenticated: %d (%s)", claims.UserID, claims.Username)

		// set user info in context
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
		if err != nil {
			c.Next()
			return
		}

		// set user info in context if valid
		if claims.Type == utils.AccessToken {
			c.Set("userID", claims.UserID)
			c.Set("email", claims.Email)
			c.Set("username", claims.Username)
		}

		c.Next()
	}
}