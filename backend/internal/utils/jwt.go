package utils

import (
	"errors"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenType string

const (
	AccessToken  TokenType = "access"
	RefreshToken TokenType = "refresh"
)

type Claims struct {
	UserID   uint      `json:"user_id"`
	Email    string    `json:"email"`
	Username string    `json:"username"`
	Type     TokenType `json:"type"`
	jwt.RegisteredClaims
}

// generates a JWT token (access or refresh)
func GenerateToken(userID uint, email, username string, tokenType TokenType, expiry time.Duration, secret string) (string, error) {
	claims := Claims{
		UserID:   userID,
		Email:    email,
		Username: username,
		Type:     tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// validates and parses a JWT token
func ValidateToken(tokenString string, secret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// verify signing
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// generates both access and refresh tokens
func GenerateTokenPair(userID uint, email, username string, accessExpiry, refreshExpiry time.Duration, secret string) (accessToken, refreshToken string, err error) {
	accessToken, err = GenerateToken(userID, email, username, AccessToken, accessExpiry, secret)
	if err != nil {
		return "", "", err
	}
	log.Println("Generated accessToken.")

	refreshToken, err = GenerateToken(userID, email, username, RefreshToken, refreshExpiry, secret)
	if err != nil {
		return "", "", err
	}
	log.Println("Generated refresh token.")

	return accessToken, refreshToken, nil
}