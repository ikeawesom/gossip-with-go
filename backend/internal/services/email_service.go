package services

import (
	"fmt"
	"strconv"

	"gopkg.in/gomail.v2"
)

type EmailService struct {
	SMTPHost      string
	SMTPPort      string
	SMTPUsername  string
	SMTPPassword  string

	EmailFrom     string
	EmailFromName string
}

func NewEmailService(host, port, username, password, from, fromName string) *EmailService {
	return &EmailService{
		SMTPHost:      host,
		SMTPPort:      port,
		SMTPUsername:  username,
		SMTPPassword:  password,
		EmailFrom:     from,
		EmailFromName: fromName,
	}
}

func (s *EmailService) SendEmail(to, subject, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", m.FormatAddress(s.EmailFrom, s.EmailFromName))
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	port, err := strconv.Atoi(s.SMTPPort)
	if err != nil {
		return err
	}

	d := gomail.NewDialer(s.SMTPHost, port, s.SMTPUsername, s.SMTPPassword)

	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}

func (s *EmailService) SendVerificationEmail(to, username, token, verifyURL string) error {
	verificationLink := fmt.Sprintf("%s/%s", verifyURL, token)
	
	subject := "Verify Your Email - Gossip With Go"
	body := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<h2 style="color: #4F46E5;">Welcome to Gossip With Go, %s!</h2>
				<p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="%s" 
					   style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
						Verify Email
					</a>
				</div>
				<p>Or copy and paste this link into your browser:</p>
				<p style="word-break: break-all; color: #4F46E5;">%s</p>
				<p style="margin-top: 30px; font-size: 12px; color: #666;">
					This link will expire in 24 hours. If you didn't create an account, please ignore this email.
				</p>
			</div>
		</body>
		</html>
	`, username, verificationLink, verificationLink)

	return s.SendEmail(to, subject, body)
}

func (s *EmailService) SendPasswordResetEmail(to, username, token, resetURL string) error {
	resetLink := fmt.Sprintf("%s/%s", resetURL, token)
	
	subject := "Reset Your Password - Gossip With Go"
	body := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<h2 style="color: #4F46E5;">Password Reset Request</h2>
				<p>Hi %s,</p>
				<p>We received a request to reset your password. Click the button below to reset it:</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="%s" 
					   style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
						Reset Password
					</a>
				</div>
				<p>Or copy and paste this link into your browser:</p>
				<p style="word-break: break-all; color: #4F46E5;">%s</p>
				<p style="margin-top: 30px; font-size: 12px; color: #666;">
					This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
				</p>
			</div>
		</body>
		</html>
	`, username, resetLink, resetLink)

	return s.SendEmail(to, subject, body)
}