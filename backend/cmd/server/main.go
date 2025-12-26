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

	postServce := services.NewPostService(db)
	
	authHandler := handlers.NewAuthHandler(authService)
	userHandler := handlers.NewUserHandler(userService)
	postHandler := handlers.NewPostHandler(postServce)

	r := gin.Default()
	routes.SetupRoutes(r, authHandler, userHandler, postHandler)

	// start server
	serverAddr := ":" + cfg.Port
	log.Printf("Server starting on %s", serverAddr)
	if err := r.Run(serverAddr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}