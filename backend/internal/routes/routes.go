package routes

import (
	"gossip-with-go/internal/config"
	"gossip-with-go/internal/handlers"
	"gossip-with-go/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, authHandler *handlers.AuthHandler) {
	// CORS configuration
	cfg := config.AppConfig
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.FrontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// group API routes
	api := r.Group("/api")
	{
		// check server health
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status": "ok",
				"message": "Server is running",
			})
		})

		// public API routes
		auth := api.Group("/auth")
		{
			auth.POST("/signup", authHandler.Signup)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
			auth.POST("/verify-email", authHandler.VerifyEmail)
			auth.POST("/resend-verification", authHandler.ResendVerification)
			auth.POST("/forgot-password", authHandler.ForgotPassword)
			auth.POST("/reset-password", authHandler.ResetPassword)
			auth.POST("/refresh", authHandler.RefreshToken)

			// protected auth routes - for testing (can remove later)
			auth.GET("/me", middleware.AuthRequired(), authHandler.GetCurrentUser)
		}
		
		// private API routes example
		protected := api.Group("")
		protected.Use(middleware.AuthRequired())
		{
			// add later
			// protected.GET("/profile", profileHandler.GetProfile)
		}
	}
}