package database

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// initializes database connection
func ConnectDatabase(databaseURL string) error {
	var err error
	
	// enable logging
	DB, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	
	if err != nil {
		log.Printf("failed to connect to database: %v", err)
		return err
	}

	// test DB connection
	sqlDB, err := DB.DB()
	if err != nil {
		log.Printf("failed to get database instance: %v", err)
		return err
	}

	if err := sqlDB.Ping(); err != nil {
		log.Printf("failed to ping database: %v", err)
		return err
	}

	log.Println("database connected successfully")
	return nil
}

func GetDB() *gorm.DB {
	return DB
}