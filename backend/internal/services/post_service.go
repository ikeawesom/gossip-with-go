package services

import (
	"errors"
	"gossip-with-go/internal/models"
	"gossip-with-go/internal/utils"
	"sort"

	"gorm.io/gorm"
)

type PostService struct {
	DB *gorm.DB
}

type NewPost struct {
	Username string
	Topic    string
	Title    string
	Content  string
}

type PaginationParams struct {
	Limit  int  
	Cursor uint
	UserID uint
}

type PaginatedPostsResponse struct {
	Posts      []PostWithTopic `json:"posts"`
	NextCursor *uint         `json:"next_cursor"`
	HasMore    bool          `json:"has_more"`
}

type PostWithUsername struct {
	models.Post
	Username string `json:"username"`
	
	UserHasLiked bool     `gorm:"-" json:"user_has_liked"`
	UserHasReposted bool  `gorm:"-" json:"user_has_reposted"` 
	Reposters    []string `gorm:"-" json:"reposters"`
}

type PostWithTopic struct {
	PostWithUsername

	TopicName  string  `json:"topic_name"`
	TopicClass string  `json:"topic_class"`
}

func NewPostService(db *gorm.DB) *PostService {
	return &PostService{
		DB: db,
	}
}

func (s *PostService) GetPostByUsername(authorUsername string, currentUser uint) ([]PostWithTopic, error) {
	var author models.User
	if err := s.DB.Where("username = ?", authorUsername).First(&author).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	var posts []PostWithTopic
	if err := s.DB.
				Table("posts").
				Select("posts.*, users.username, topics.id as topic_id, topics.topic_name, topics.topic_class").
				Joins("JOIN topics ON posts.topic = topics.id").
				Joins("JOIN users ON users.id = posts.user_id").
				Where("posts.user_id = ?", author.ID).
				Order("posts.created_at DESC").
				Find(&posts).Error; err != nil {
					if errors.Is(err, gorm.ErrRecordNotFound) {
						return nil, errors.New("posts not found")
					}
					return nil, err
				}

	if err := s.encrichWithInteractionData(posts, currentUser); err != nil {
		return nil, err
	}	

	return posts, nil
}

func (s *PostService) GetPostByTopic(topicID int, currentUser uint) ([]PostWithTopic, error) {
	var posts []PostWithTopic
	if err := s.DB.
				Table("posts").
				Select("posts.*, users.username, topics.id as topic_id, topics.topic_name, topics.topic_class").
				Joins("JOIN topics ON posts.topic = topics.id").
				Joins("JOIN users ON users.id = posts.user_id").
				Where("topics.id = ?", topicID).
				Order("created_at DESC").
				Find(&posts).Error; err != nil {
					if errors.Is(err, gorm.ErrRecordNotFound) {
						return nil, errors.New("posts not found")
					}
					return nil, err
				}

	if err := s.encrichWithInteractionData(posts, currentUser); err != nil {
		return nil, err
	}

	return posts, nil
}

func (s *PostService) GetUserPostByID(authorUsername string, postID uint, currentUser uint) (*PostWithTopic, error) {
	var author models.User
	if err := s.DB.Where("username = ?", authorUsername).First(&author).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("author not found")
		}
		return nil, err
	}

	var post PostWithTopic
	if err := s.DB.
			Table("posts").
			Select("posts.*, users.username, topics.id as topic_id, topics.topic_name, topics.topic_class").
			Joins("JOIN topics ON posts.topic = topics.id").
			Joins("JOIN users ON users.id = posts.user_id").
			Where("posts.id = ? AND posts.user_id = ?", postID, author.ID).Order("created_at DESC").First(&post).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return nil, errors.New("post not found")
				}
				return nil, err
			}
	post.Username = authorUsername

	var post_array = []PostWithTopic{post}

	if err := s.encrichWithInteractionData(post_array, currentUser); err != nil {
		return nil, err
	}

	// utils.DebugLog("post:", post_array)
	return &(post_array[0]), nil
}

func (s *PostService) CreatePost(username, title, content string, topic uint) (uint, error) {
	// get userID of username
	var user models.User
	if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return 0, err
	}

	topicID := uint(topic);

	// create post
	newPost := models.Post{
		UserID: user.ID,
		Topic: topicID,
		Title: title,
		Content: content,
	}

	utils.DebugLog("new post:", newPost)

	if err := s.DB.Create(&newPost).Error; err != nil {
		return 0, err
	}

	// increment post count on topic
	if err := s.DB.
			Table("topics").
			Where("id = ?", topicID).
			Update("post_count", gorm.Expr("post_count + ?", 1)).
			Error; err != nil {
				utils.DebugLog("error:", err)
				return 0, err
			}

	return newPost.ID, nil
}

func (s *PostService) EditPost(postID uint, username, title, content string, topic uint) error {
    var user models.User
    if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
        return errors.New("user not found")
    }
    var post models.Post
    if err := s.DB.First(&post, postID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return errors.New("post not found")
        }
        return err
    }

    // check if user owns the post
    if post.UserID != user.ID {
        return errors.New("unauthorized to edit this post")
    }

   // update post
    post.Topic = topic
    post.Title = title
    post.Content = content

    if err := s.DB.Save(&post).Error; err != nil {
        return err
    }
   return nil
}

func (s *PostService) DeletePost(postID uint, username string) error {
    var user models.User
    if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
        return errors.New("user not found")
    }
    var post PostWithTopic
    if err := s.DB.First(&post, postID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return errors.New("post not found")
        }
        return err
    }

    // check if user owns the post
    if post.UserID != user.ID {
        return errors.New("unauthorized to delete this post")
    }

   // delete post
   if err := s.DB.Delete(&post).Error; err != nil {
        return err
    }

	// decrement post count on topic
	if err := s.DB.Table("topics").
		Where("id = ? AND post_count > 0", post.Topic).
		Update("post_count", gorm.Expr("post_count - ?", 1)).
		Error; err != nil {
			return err
		}
   return nil
}

func (s *PostService) GetTrendingPosts(params PaginationParams) (*PaginatedPostsResponse, error) {

	// validate parameters
	if params.Limit <= 0 {
		params.Limit = 10 // default to 10 posts per page
	}
	if params.Limit > 50 {
		params.Limit = 50 // maximum 50 posts per page
	}

	query := s.DB.
		Table("posts").
		Select("posts.*, users.username, topics.id as topic_id, topics.topic_name, topics.topic_class").
		Joins("JOIN topics ON posts.topic = topics.id").
		Joins("JOIN users ON users.id = posts.user_id")

	if params.Cursor > 0 {
		query = query.Where("posts.id < ?", params.Cursor)
	}

	var posts []PostWithTopic
	if err := query.
		Order("posts.created_at DESC").
		Limit(params.Limit + 1). // fetch +1 to check if there are more posts
		Find(&posts).Error; err != nil {
		return nil, err
	}


	posts = CalculatePostScores(posts)
	sortPostsByScore(posts)

	// check if there are more posts (because of +1 earlier)
	hasMore := len(posts) > params.Limit
	if hasMore {
		posts = posts[:params.Limit] // trim to limit
	}

	// only enrich if user is authenticated - HERE
	if (params.UserID > 0) {
		if err := s.encrichWithInteractionData(posts, params.UserID); err != nil {
			return nil, err
		}
	}

	// determine next cursor
	var nextCursor *uint
	if hasMore && len(posts) > 0 {
		lastPostID := posts[len(posts)-1].ID
		nextCursor = &lastPostID
	}

	return &PaginatedPostsResponse{
		Posts:      posts,
		NextCursor: nextCursor,
		HasMore:    hasMore,
	}, nil
}

func (s *PostService) GetFollowingPosts(params PaginationParams) (*PaginatedPostsResponse, error) {

	// validate parameters
	if params.Limit <= 0 {
		params.Limit = 10 // default to 10 posts per page
	}
	if params.Limit > 50 {
		params.Limit = 50 // maximum 50 posts per page
	}

	query := s.DB.
		Table("posts").
		Select("posts.*, users.username, topics.id as topic_id, topics.topic_name, topics.topic_class").
		Joins("JOIN topics ON posts.topic = topics.id").
		Joins("JOIN users ON users.id = posts.user_id").
		Joins(`LEFT JOIN follows AS user_follows ON 
			user_follows.follower_id = ? AND 
			user_follows.follow_type = 'user' AND 
			user_follows.following_id = posts.user_id`, params.UserID).
		Joins(`LEFT JOIN follows AS topic_follows ON 
			topic_follows.follower_id = ? AND 
			topic_follows.follow_type = 'topic' AND 
			topic_follows.following_id = posts.topic`, params.UserID).
		Where("user_follows.id IS NOT NULL OR topic_follows.id IS NOT NULL")

	if params.Cursor > 0 {
		query = query.Where("posts.id < ?", params.Cursor)
	}

	var posts []PostWithTopic
	if err := query.
		Order("posts.created_at DESC").
		Limit(params.Limit + 1). // fetch +1 to check if there are more posts
		Find(&posts).Error; err != nil {
		return nil, err
	}


	posts = CalculatePostScores(posts)
	sortPostsByScore(posts)

	// check if there are more posts (because of +1 earlier)
	hasMore := len(posts) > params.Limit
	if hasMore {
		posts = posts[:params.Limit] // trim to limit
	}

	// only enrich if user is authenticated - HERE
	if (params.UserID > 0) {
		if err := s.encrichWithInteractionData(posts, params.UserID); err != nil {
			return nil, err
		}
	}

	// Determine next cursor
	var nextCursor *uint
	if hasMore && len(posts) > 0 {
		lastPostID := posts[len(posts)-1].ID
		nextCursor = &lastPostID
	}

	return &PaginatedPostsResponse{
		Posts:      posts,
		NextCursor: nextCursor,
		HasMore:    hasMore,
	}, nil
}

func (s *PostService) encrichWithInteractionData(posts []PostWithTopic, currentUserID uint) error {
	if len(posts) == 0 {
		return nil
	}

	postIDs := make([]uint, len(posts))
	for i, post := range posts {
		postIDs[i] = post.ID
	}

	// get current user's likes in ONE query
	var userLikes []models.Like
	if currentUserID > 0 {
		s.DB.Where("user_id = ? AND likeable_type = ? AND likeable_id IN ?", 
			currentUserID, "post", postIDs).
			Find(&userLikes)
	}

	// get current user's reposts
	var userReposts []models.Repost
	if currentUserID > 0 {
		s.DB.Where("user_id = ? AND post_id IN ?", 
			currentUserID, postIDs).
			Find(&userReposts)
	}

	// use map for fast lookup
	userLikesMap := make(map[uint]bool)
	for _, like := range userLikes {
		userLikesMap[like.LikeableID] = true
	}

	userRepostsMap := make(map[uint]bool)
	for _, repost := range userReposts {
		userRepostsMap[repost.PostID] = true
	}

	type InteractionResult struct {
		PostID   uint   `json:"post_id"`
		Username string `json:"username"`
	}
	
	// get user's following reposters for all posts
	var repostResults []InteractionResult
	s.DB.Table("reposts").
		Select("reposts.post_id, users.username").
		Joins("JOIN users ON users.id = reposts.user_id").
		Joins("JOIN follows ON follows.following_id = reposts.user_id AND follows.follower_id = ?", currentUserID).
		Where("reposts.post_id IN ?", postIDs).
		Order("reposts.created_at DESC").
		Find(&repostResults)

	// group reposters by post ID
	repostersMap := make(map[uint][]string)
	for _, result := range repostResults {
		repostersMap[result.PostID] = append(repostersMap[result.PostID], result.Username)
	}

	// ppulate post fields
	for i := range posts {
		postID := posts[i].ID
		
		posts[i].UserHasLiked = userLikesMap[postID] // set to user liked
		posts[i].UserHasReposted = userRepostsMap[postID] // set to user reposted

		// set top mutual reposters (limit to first 3 for preview)
		if reposters, ok := repostersMap[postID]; ok {
			if len(reposters) > 3 {
				posts[i].Reposters = reposters[:3]
			} else {
				posts[i].Reposters = reposters
			}
		} else {
			posts[i].Reposters = []string{}
		}
	}

	// utils.DebugLog("final posts:", posts)
	return nil
}

func sortPostsByScore(posts []PostWithTopic) {
	sort.Slice(posts, func(i, j int) bool {
		return posts[i].Score > posts[j].Score
	})
}