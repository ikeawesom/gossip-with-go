package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port    string
	GinMode string

	DatabaseURL string

	JWTSecret              string
	JWTAccessTokenExpiry   time.Duration
	JWTRefreshTokenExpiry  time.Duration

	CookieDomain   string
	CookieSecure   bool
	CookieSameSite string

	FrontendURL string

	SMTPHost               string
	SMTPPort               string
	SMTPUsername           string
	SMTPPassword           string
	EmailFrom              string
	EmailFromName          string
	FrontendVerifyEmailURL string
	FrontendResetPasswordURL string
}

var AppConfig *Config

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	accessTokenExpiry, err := time.ParseDuration(getEnv("JWT_ACCESS_TOKEN_EXPIRY", "15m"))
	if err != nil {
		log.Fatal("Invalid JWT_ACCESS_TOKEN_EXPIRY format")
	}

	refreshTokenExpiry, err := time.ParseDuration(getEnv("JWT_REFRESH_TOKEN_EXPIRY", "720h"))
	if err != nil {
		log.Fatal("Invalid JWT_REFRESH_TOKEN_EXPIRY format")
	}

	// init config
	AppConfig = &Config{
		Port:    getEnv("PORT", "8080"),
		GinMode: getEnv("GIN_MODE", "debug"),

		DatabaseURL: getEnv("DATABASE_URL", ""),

		JWTSecret:             getEnv("JWT_SECRET", ""),
		JWTAccessTokenExpiry:  accessTokenExpiry,
		JWTRefreshTokenExpiry: refreshTokenExpiry,

		CookieDomain:   getEnv("COOKIE_DOMAIN", "localhost"),
		CookieSecure:   getEnv("COOKIE_SECURE", "false") == "true",
		CookieSameSite: getEnv("COOKIE_SAME_SITE", "Lax"),

		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"),

		SMTPHost:                 getEnv("SMTP_HOST", ""),
		SMTPPort:                 getEnv("SMTP_PORT", "587"),
		SMTPUsername:             getEnv("SMTP_USERNAME", ""),
		SMTPPassword:             getEnv("SMTP_PASSWORD", ""),
		EmailFrom:                getEnv("EMAIL_FROM", ""),
		EmailFromName:            getEnv("EMAIL_FROM_NAME", "Gossip With Go"),
		FrontendVerifyEmailURL:   getEnv("FRONTEND_VERIFY_EMAIL_URL", ""),
		FrontendResetPasswordURL: getEnv("FRONTEND_RESET_PASSWORD_URL", ""),
	}

	if AppConfig.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}
	if AppConfig.JWTSecret == "" {
		log.Fatal("JWT_SECRET is required")
	}

	return AppConfig
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}