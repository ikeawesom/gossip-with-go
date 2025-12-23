package services

import (
	"errors"
	"log"
	"time"

	"gossip-with-go/internal/config"
	"gossip-with-go/internal/models"
	"gossip-with-go/internal/utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthService struct {
	DB           *gorm.DB
	EmailService *EmailService
}

func NewAuthService(db *gorm.DB, emailService *EmailService) *AuthService {
	return &AuthService{
		DB:           db,
		EmailService: emailService,
	}
}

func (s *AuthService) Signup(username, email, password string) (*models.User, error) {
	// check if user already exists
	var existingUser models.User
	if err := s.DB.Where("email = ? OR username = ?", email, username).First(&existingUser).Error; err == nil {
		if existingUser.Email == email {
			return nil, errors.New("email already registered")
		}
		return nil, errors.New("username already taken")
	}

	// hash password
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return nil, err
	}

	// generate verification token
	verificationToken := uuid.New().String()
	verificationExpiry := time.Now().Add(24 * time.Hour)

	// create user
	user := models.User{
		Username:           username,
		Email:              email,
		Password:           hashedPassword,
		EmailVerified:      false,
		VerificationToken:  &verificationToken,
		VerificationExpiry: &verificationExpiry,
	}

	if err := s.DB.Create(&user).Error; err != nil {
		return nil, err
	}

	// send verification email
	cfg := config.AppConfig
	go s.EmailService.SendVerificationEmail(
		user.Email,
		user.Username,
		verificationToken,
		cfg.FrontendVerifyEmailURL,
	)

	return &user, nil
}

func (s *AuthService) Login(username, password string) (*models.User, error) {
	log.Println("Service: Authenticating user...")
	var user models.User
	if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid username or password")
		}
		return nil, err
	}

	// check password
	if err := utils.CheckPassword(user.Password, password); err != nil {
		return nil, errors.New("invalid username or password")
	}

	return &user, nil
}

func (s *AuthService) VerifyEmail(token string) error {
	var user models.User
	if err := s.DB.Where("verification_token = ?", token).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("invalid or expired verification token")
		}
		return err
	}

	// check if token is expired
	if user.VerificationExpiry != nil && time.Now().After(*user.VerificationExpiry) {
		return errors.New("verification token has expired")
	}

	// update user
	user.EmailVerified = true
	user.VerificationToken = nil
	user.VerificationExpiry = nil

	if err := s.DB.Save(&user).Error; err != nil {
		return err
	}

	return nil
}

func (s *AuthService) ResendVerification(email string) error {
	var user models.User
	if err := s.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("user not found")
		}
		return err
	}

	if user.EmailVerified {
		return errors.New("email already verified")
	}

	// generate a new verification token
	verificationToken := uuid.New().String()
	verificationExpiry := time.Now().Add(24 * time.Hour)

	user.VerificationToken = &verificationToken
	user.VerificationExpiry = &verificationExpiry

	if err := s.DB.Save(&user).Error; err != nil {
		return err
	}

	// send verification email again (if have haven't already - previous failed)
	cfg := config.AppConfig
	go s.EmailService.SendVerificationEmail(
		user.Email,
		user.Username,
		verificationToken,
		cfg.FrontendVerifyEmailURL,
	)

	return nil
}

func (s *AuthService) ForgotPassword(email string) error {
	var user models.User
	if err := s.DB.Where("email = ?", email).First(&user).Error; err != nil {
		// dont reveal if user exists
		return nil
	}

	// generate reset token
	resetToken := uuid.New().String()
	resetExpiry := time.Now().Add(1 * time.Hour)

	user.ResetToken = &resetToken
	user.ResetExpiry = &resetExpiry

	if err := s.DB.Save(&user).Error; err != nil {
		return err
	}

	// send reset email
	cfg := config.AppConfig
	go s.EmailService.SendPasswordResetEmail(
		user.Email,
		user.Username,
		resetToken,
		cfg.FrontendResetPasswordURL,
	)

	return nil
}

func (s *AuthService) ResetPassword(token, newPassword string) error {
	var user models.User
	if err := s.DB.Where("reset_token = ?", token).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("invalid or expired reset token")
		}
		return err
	}

	// check if token is expired
	if user.ResetExpiry != nil && time.Now().After(*user.ResetExpiry) {
		return errors.New("reset token has expired")
	}

	// hash new password
	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}

	// update user
	user.Password = hashedPassword
	user.ResetToken = nil
	user.ResetExpiry = nil

	if err := s.DB.Save(&user).Error; err != nil {
		return err
	}

	return nil
}

func (s *AuthService) GetUserByID(userID uint) (*models.User, error) {
	var user models.User
	if err := s.DB.First(&user, userID).Error; err != nil {
		return nil, err
	}
	return &user, nil
}