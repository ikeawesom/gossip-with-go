package main

import (
	"log"

	"gossip-with-go/internal/config"
	"gossip-with-go/internal/database"
	"gossip-with-go/internal/handlers"
	"gossip-with-go/internal/routes"
	"gossip-with-go/internal/services"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	gin.SetMode(cfg.GinMode)

	// connect to DB
	if err := database.ConnectDatabase(cfg.DatabaseURL); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// init services
	emailService := services.NewEmailService(
		cfg.SMTPHost,
		cfg.SMTPPort,
		cfg.SMTPUsername,
		cfg.SMTPPassword,
		cfg.EmailFrom,
		cfg.EmailFromName,
	)

	db := database.GetDB()
	authService := services.NewAuthService(db, emailService)
	userService := services.NewUserService(db)
	followService := services.NewFollowService(db)

	topicService := services.NewTopicService(db)

	postService := services.NewPostService(db)
	likeService := services.NewLikeService(db)
	repostService := services.NewRepostService(db)
	commentService := services.NewCommentService(db)
	
	queryService := services.NewQueryService(db)
	
	authHandler := handlers.NewAuthHandler(authService)
	userHandler := handlers.NewUserHandler(userService)
	followHandler := handlers.NewFollowHandler(followService)
	
	topicHandler := handlers.NewTopicHandler(topicService)

	postHandler := handlers.NewPostHandler(postService)
	likeHandler := handlers.NewLikeHandler(likeService)
	repostHandler := handlers.NewRepostHandler(repostService)
	commentHandler := handlers.NewCommentHandler(commentService)

	queryHandler := handlers.NewQueryHandler(queryService)

	r := gin.Default()
	routes.SetupRoutes(r, authHandler, userHandler, postHandler, likeHandler, repostHandler, commentHandler, queryHandler, followHandler, topicHandler)

	// start server
	serverAddr := ":" + cfg.Port
	log.Printf("Server starting on %s", serverAddr)
	if err := r.Run(serverAddr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}