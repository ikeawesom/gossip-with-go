package routes

import (
	"gossip-with-go/internal/config"
	"gossip-with-go/internal/handlers"
	"gossip-with-go/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, authHandler *handlers.AuthHandler, userHandler *handlers.UserHandler, postHandler *handlers.PostHandler, likeHandler *handlers.LikeHandler, repostHandler *handlers.RepostHandler, commentHandler *handlers.CommentHandler, queryHandler *handlers.QueryHandler, followHandler *handlers.FollowHandler, topicHandler *handlers.TopicHandler) {
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

		// auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/signup", authHandler.Signup)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
			auth.POST("/verify-email", authHandler.VerifyEmail)
			auth.POST("/resend-verification", authHandler.ResendVerification)
			auth.POST("/forgot-password", authHandler.ForgotPassword)
			auth.POST("/check-reset-token", authHandler.CheckResetToken)
			auth.POST("/reset-password", authHandler.ResetPassword)
			auth.POST("/refresh", authHandler.RefreshToken)

			// authenticated endpoints for auth - for testing
			auth.GET("/me", middleware.AuthRequired(), authHandler.GetCurrentUser)
		}

		// user routes
		users := api.Group("/users")
		{
			users.GET("/:username", middleware.AuthOptional(), userHandler.GetUserByUsername)
			users.GET("/:username/followers", userHandler.GetFollowersByUsername)
			users.GET("/:username/followings", userHandler.GetFollowingsByUsername)
		}

		// post routes
		posts := api.Group("/posts")
		{
			posts.GET("/topic/:topic", middleware.AuthOptional(), postHandler.GetPostsByTopic)
			posts.GET("/users/:username", middleware.AuthOptional(), postHandler.GetPostsByUsername)
			posts.GET("/users/:username/:postID", middleware.AuthOptional(), postHandler.GetUserPostByID)
			posts.GET("/trending", middleware.AuthOptional(), postHandler.GetTrendingPosts)
			posts.GET("/following", middleware.AuthOptional(), postHandler.GetFollowingPosts)
			posts.POST("/create", middleware.AuthRequired(), postHandler.CreatePost)
			posts.POST("/edit/:postID", middleware.AuthRequired(), postHandler.EditPost)
			posts.POST("/delete/:postID", middleware.AuthRequired(), postHandler.DeletePost)
		}

		// likes routes
		likes := api.Group("/likes")
		{
			likes.GET("/likers", likeHandler.GetLikers)
			
			// authenticated endpoints for likes
			likes.GET("/status", middleware.AuthRequired(), likeHandler.GetLikeStatus)
			likes.POST("/toggle", middleware.AuthRequired(), likeHandler.ToggleLike)
		}
		
		reposts := api.Group("/reposts")
		{
			reposts.GET("/reposters", repostHandler.GetReposters)
			reposts.GET("/user/:username", repostHandler.GetUserReposts)
			
			// authenticted endpoints for reposts
			reposts.POST("/toggle", middleware.AuthRequired(),repostHandler.ToggleRepost)
			reposts.GET("/status",middleware.AuthRequired(), repostHandler.GetRepostStatus)
			reposts.POST("/update-visibility",middleware.AuthRequired(), repostHandler.UpdateRepostVisibility)
			
		}
		
		comments := api.Group("/comments")
		{
			comments.GET("/post/:postID", middleware.AuthOptional(), commentHandler.GetRootComments)
			
			comments.GET("/:id/replies", middleware.AuthOptional(), commentHandler.GetReplies)
			
			// authenticted endpoints for comments
			comments.POST("/root", middleware.AuthRequired(), commentHandler.CreateRootComment)      
			comments.POST("/reply", middleware.AuthRequired(), commentHandler.CreateReply)           
			comments.GET("/toggle-pin/:id", middleware.AuthRequired(), commentHandler.PinComment)           
			comments.DELETE("/:id", middleware.AuthRequired(), commentHandler.DeleteComment)         
		}

		api.GET("/query", queryHandler.GetResultsByType)

		// topics
		topics := api.Group("/topics")
		{
			topics.GET("/trending", topicHandler.GetTrendingTopics)
			topics.GET("/:topicID", middleware.AuthOptional(), topicHandler.GetTopicByID)
			topics.POST("/create", middleware.AuthRequired(), topicHandler.CreateTopic)
			topics.POST("/delete/:topicID", middleware.AuthRequired(), topicHandler.DeletePost)
		}
		
		follow := api.Group("/follow") 
		{
			follow.POST("/toggle", middleware.AuthRequired(), followHandler.ToggleFollow)
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