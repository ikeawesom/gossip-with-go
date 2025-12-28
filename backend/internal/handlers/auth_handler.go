package handlers

import (
	"log"
	"net/http"

	"gossip-with-go/internal/config"
	"gossip-with-go/internal/services"
	"gossip-with-go/internal/utils"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	AuthService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		AuthService: authService,
	}
}

type SignupRequest struct {
	Username        string `json:"username" binding:"required"`
	Email           string `json:"email" binding:"required,email"`
	Password        string `json:"password" binding:"required"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

type LoginRequest struct {
	Username    string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type VerifyEmailRequest struct {
	Token string `json:"token" binding:"required"`
}

type ResendVerificationRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ForgotPasswordRequest struct {
	Username string `json:"username" binding:"required"`
}

type ResetPasswordRequest struct {
	Token           string `json:"token" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

func (h *AuthHandler) Signup(c *gin.Context) {
	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	if req.Password != req.ConfirmPassword {
		utils.ErrorResponse(c, http.StatusBadRequest, "Passwords do not match", nil)
		return
	}

	// create user
	user, err := h.AuthService.Signup(req.Username, req.Email, req.Password)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Account created! Please check your email to verify your account.", gin.H{
		"user": user.ToResponse(),
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	log.Println("Attempting login")
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}
	// log.Fatal("FORCED ERROR")

	// authenticate user
	user, err := h.AuthService.Login(req.Username, req.Password)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error(), nil)
		log.Println(err)
		return
	}

	log.Println("after auth");
	
	// generate tokens
	cfg := config.AppConfig
	accessToken, refreshToken, err := utils.GenerateTokenPair(
		user.ID,
		user.Email,
		user.Username,
		cfg.JWTAccessTokenExpiry,
		cfg.JWTRefreshTokenExpiry,
		cfg.JWTSecret,
	)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to generate tokens", nil)
		return
	}
	log.Println("generated token");

	// set cookies
	setTokenCookies(c, accessToken, refreshToken)
	log.Println("set cookies");

	utils.SuccessResponse(c, http.StatusOK, "Login successful", gin.H{
		"user": user.ToResponse(),
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	// clear cookies
	clearTokenCookies(c)
	log.Println("Logged out")
	utils.SuccessResponse(c, http.StatusOK, "Logout successful", nil)
}

func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	user, err := h.AuthService.GetUserByID(userID.(uint))
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "User not found", nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{
		"user": user.ToResponse(),
	})
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Refresh token not found", nil)
		return
	}

	// validate refresh token
	cfg := config.AppConfig
	claims, err := utils.ValidateToken(refreshToken, cfg.JWTSecret)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid refresh token", nil)
		return
	}

	if claims.Type != utils.RefreshToken {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid token type", nil)
		return
	}

	// generate new access token
	newAccessToken, err := utils.GenerateToken(
		claims.UserID,
		claims.Email,
		claims.Username,
		utils.AccessToken,
		cfg.JWTAccessTokenExpiry,
		cfg.JWTSecret,
	)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to generate token", nil)
		return
	}

	setAccessTokenCookie(c, newAccessToken)

	log.Println("Token refreshed")
	utils.SuccessResponse(c, http.StatusOK, "Token refreshed", nil)
}

func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	var req VerifyEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	if err := h.AuthService.VerifyEmail(req.Token); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Email verified successfully!", nil)
}

func (h *AuthHandler) ResendVerification(c *gin.Context) {
	var req ResendVerificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	if err := h.AuthService.ResendVerification(req.Email); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Verification email sent!", nil)
}
func (h *AuthHandler) CheckResetToken(c *gin.Context) {
	var req VerifyEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}
	if err := h.AuthService.CheckResetToken(req.Token); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Reset token is valid", nil)
}

func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	if err := h.AuthService.ForgotPassword(req.Username); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "s", nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "If the email exists, a password reset link has been sent", nil)
}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err.Error())
		return
	}

	if req.NewPassword != req.ConfirmPassword {
		utils.ErrorResponse(c, http.StatusBadRequest, "Passwords do not match", nil)
		return
	}

	if err := h.AuthService.ResetPassword(req.Token, req.NewPassword); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Password reset successful!", nil)
}

func setTokenCookies(c *gin.Context, accessToken, refreshToken string) {
	cfg := config.AppConfig

	// access token cookie
	c.SetSameSite(http.SameSiteNoneMode) 
	c.SetCookie(
		"access_token",
		accessToken,
		int(cfg.JWTAccessTokenExpiry.Seconds()),
		"/",
		cfg.CookieDomain,
		cfg.CookieSecure,
		true, 
	)

	// refresh token cookie
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(
		"refresh_token",
		refreshToken,
		int(cfg.JWTRefreshTokenExpiry.Seconds()),
		"/",
		cfg.CookieDomain,
		cfg.CookieSecure,
		true, 
	)
}

func setAccessTokenCookie(c *gin.Context, accessToken string) {
	cfg := config.AppConfig

	c.SetCookie(
		"access_token",
		accessToken,
		int(cfg.JWTAccessTokenExpiry.Seconds()),
		"/",
		cfg.CookieDomain,
		cfg.CookieSecure,
		true,
	)
}

func clearTokenCookies(c *gin.Context) {
	cfg := config.AppConfig

	c.SetCookie("access_token", "", -1, "/", cfg.CookieDomain, cfg.CookieSecure, true)
	c.SetCookie("refresh_token", "", -1, "/", cfg.CookieDomain, cfg.CookieSecure, true)
}