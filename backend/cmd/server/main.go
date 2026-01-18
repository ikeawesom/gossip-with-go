package main

import (
	"log"

	"gossip-with-go/internal/cloudinary"
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

	// connect to cloudinary
	if err := cloudinary.InitCloudinary(cfg.CloudName, cfg.CloudKey, cfg.CloudSecret); err != nil {
		log.Fatal("Failed to connect to cloudinary:", err)
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

	// init services using DB
	authService := services.NewAuthService(db, emailService)
	userService := services.NewUserService(db)
	followService := services.NewFollowService(db)

	notificationService := services.NewNotificationService(db)

	topicService := services.NewTopicService(db)
	postService := services.NewPostService(db)

	likeService := services.NewLikeService(db)
	repostService := services.NewRepostService(db, postService)
	commentService := services.NewCommentService(db)
	
	queryService := services.NewQueryService(db)
	
	// init handlers from services
	authHandler := handlers.NewAuthHandler(authService)
	userHandler := handlers.NewUserHandler(userService)
	followHandler := handlers.NewFollowHandler(followService)

	notificationHandler := handlers.NewNotificationHandler(notificationService)
	
	topicHandler := handlers.NewTopicHandler(topicService)

	postHandler := handlers.NewPostHandler(postService)
	likeHandler := handlers.NewLikeHandler(likeService)
	repostHandler := handlers.NewRepostHandler(repostService)
	commentHandler := handlers.NewCommentHandler(commentService)

	queryHandler := handlers.NewQueryHandler(queryService)

	// set up routes
	r := gin.Default()
	routes.SetupRoutes(r, authHandler, userHandler, postHandler, likeHandler, repostHandler, commentHandler, queryHandler, followHandler, topicHandler, notificationHandler)

	// start server
	serverAddr := ":" + cfg.Port
	log.Printf("Server starting on %s", serverAddr)
	if err := r.Run(serverAddr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}