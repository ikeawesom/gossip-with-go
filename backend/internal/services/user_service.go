package services

import (
	"errors"
	"gossip-with-go/internal/models"

	"gorm.io/gorm"
)

type UserService struct {
	DB *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{
		DB: db,
	}
}

type UserWithFollowers struct {
	models.User
	
	UserHasFollowed     bool     `gorm:"-" json:"user_has_followed"`
	UserIsBeingFollowed bool     `gorm:"-" json:"user_is_being_followed"`
	Followers           []string `gorm:"-" json:"followers"`
	Followings          []string `gorm:"-" json:"followings"`
}

type UserWithBuzz struct {
	UserWithFollowers

	Buzz int `gorm:"-" json:"buzz"`
}

type GetUserRequest struct {
	Username string `json:"username" binding:"required"`
}

type GetUserByUsernameParams struct {
	Username string `json:"username" binding:"required"`
	CurrentUserID uint `json:"id" binding:"required"`
}

type FollowersListType struct {
	UserID uint `json:"id"`
	Username string `json:"username"`
}

func (s *UserService) EditProfile(userID uint, username, bio string) error {
    var user models.User
    if err := s.DB.Where("id = ?", userID).First(&user).Error; err != nil {
        return errors.New("user not found")
    }

   // update user details
    user.Username = username
    user.Bio = bio

    if err := s.DB.Save(&user).Error; err != nil {
        return err
    }
	
	return nil
}

func (s *UserService) GetUserByUsername(params GetUserByUsernameParams) (*UserWithBuzz, error) {
	var user UserWithBuzz
	if err := s.DB.Where("username = ?", params.Username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("No user found with the given username")
		}
		return nil, err
	}
	
	if err := s.enrichFollowersFollowings(&user, params.CurrentUserID); err != nil {
		return nil, err
	}

	user.Buzz = s.CalculateUserBuzz(user.ID)

	return &user, nil
}

func (s *UserService) enrichFollowersFollowings(user *UserWithBuzz, currentUser uint) error {
	userID := user.ID

	// current user relationship
	if currentUser > 0 {
		var count int64

		// current user has followed this user
		s.DB.Table("follows").
			Where("follower_id = ? AND following_id = ? AND follow_type = ?", currentUser, userID, "user").
			Count(&count)
		user.UserHasFollowed = count > 0

		// current user being followed by this user
		s.DB.Table("follows").
			Where("follower_id = ? AND following_id = ? AND follow_type = ?", userID, currentUser, "user").
			Count(&count)
		user.UserIsBeingFollowed = count > 0
	}

	// get user followers
	type Result struct {
		Username string
	}

	var followers []Result
	s.DB.Table("follows").
		Select("users.username").
		Joins("JOIN users ON users.id = follows.follower_id").
		Where("follows.following_id = ? AND follow_type = ?", userID, "user").
		Order("follows.created_at DESC").
		Limit(3).
		Scan(&followers)

	user.Followers = make([]string, len(followers))
	for i, f := range followers {
		user.Followers[i] = f.Username
	}

	// get user followings
	var followings []Result
	s.DB.Table("follows").
		Select("users.username").
		Joins("JOIN users ON users.id = follows.following_id").
		Where("follows.follower_id = ? AND follow_type = ?", userID, "user").
		Order("follows.created_at DESC").
		Limit(3).
		Scan(&followings)

	user.Followings = make([]string, len(followings))
	for i, f := range followings {
		user.Followings[i] = f.Username
	}

	return nil
}

func (s* UserService) GetUserFollowers(username string) ([]FollowersListType, error) {
	var user models.User
	if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("No user found with the given username")
		}
		return nil, err
	}

	var followers []FollowersListType
	if err := s.DB.
				Table("users").
				Select("follows.following_id, users.username").
				Joins("JOIN follows ON follows.follower_id = users.id").
				Where("following_id = ? AND follow_type = ?", user.ID, "user").
				Find(&followers).Error; err != nil {
					// user has no followers
					return []FollowersListType{}, nil
				}
	
    return followers, nil
}

func (s* UserService) GetUserFollowings(username string) ([]FollowersListType, error) {
	var user models.User
	if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("No user found with the given username")
		}
		return nil, err
	}

	var followers []FollowersListType
	if err := s.DB.
				Table("users").
				Select("follows.following_id, users.username").
				Joins("JOIN follows ON follows.following_id = users.id").
				Where("follower_id = ? AND follow_type = ?", user.ID, "user").
				Find(&followers).Error; err != nil {
					// user has no followers
					return []FollowersListType{}, nil
				}
	
    return followers, nil
}
