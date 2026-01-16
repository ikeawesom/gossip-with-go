package services

import (
	"context"
	"errors"
	"gossip-with-go/internal/cloudinary"
	"gossip-with-go/internal/models"
	"gossip-with-go/internal/utils"
	"log"
	"mime/multipart"
	"net/http"
	"sort"
	"strconv"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
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

type PostWithUsername struct {
	models.Post
	Username string `json:"username"`
	Pfp		 string `json:"pfp"`
	
	UserHasLiked bool     `gorm:"-" json:"user_has_liked"`
	UserHasReposted bool  `gorm:"-" json:"user_has_reposted"` 
	Reposters    []string `gorm:"-" json:"reposters"`
}

type PostWithTopic struct {
	PostWithUsername

	TopicName  string  `json:"topic_name"`
	TopicClass string  `json:"topic_class"`
}

type PaginatedPostsResponse struct {
	Posts      []PostWithTopic `json:"posts"`
	NextCursor *uint         `json:"next_cursor"`
	HasMore    bool          `json:"has_more"`
}

type PaginationParams struct {
	Limit  int  
	Cursor uint
	UserID uint
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
				Select("posts.*, users.username, users.pfp, topics.id as topic_id, topics.topic_name, topics.topic_class").
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

	// enrich with media on posts
	if err := s.enrichWithMedia(posts); err != nil {
		return nil, err
	}

	utils.DebugLog("Posts:", posts)
	return posts, nil
}

func (s *PostService) GetPostByTopic(topicID int, currentUser uint) ([]PostWithTopic, error) {
	var posts []PostWithTopic
	if err := s.DB.
				Table("posts").
				Select("posts.*, users.username, users.pfp, topics.id as topic_id, topics.topic_name, topics.topic_class").
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

	// enrich with media on posts
	if err := s.enrichWithMedia(posts); err != nil {
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
			Select("posts.*, users.username, users.pfp, topics.id as topic_id, topics.topic_name, topics.topic_class").
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

	// enrich with media on posts
	if err := s.enrichWithMedia(post_array); err != nil {
		return nil, err
	}

	return &(post_array[0]), nil
}

func (s *PostService) CreatePost(username, title, content string, topic uint, imgFiles []*multipart.FileHeader) (uint, error) {
	log.Println("[SERVICE] Creating post...")
	// get userID of username
	var user models.User
	if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return 0, err
	}
	
	// create post
	newPost := models.Post{
		UserID: user.ID,
		Topic: topic,
		Title: title,
		Content: content,
	}
	
	if err := s.DB.Create(&newPost).Error; err != nil {
		return 0, err
	}
	
	log.Println("[SERVICE] Added post")

	// increment post count on topic
	if err := s.DB.
	Table("topics").
	Where("id = ?", topic).
	Update("post_count", gorm.Expr("post_count + ?", 1)).
	Error; err != nil {
		return 0, err
			}
			
	log.Println("[SERVICE] Incremented topic")	

	const maxImgSize = 5 << 20 // 5MB

	for i, file := range imgFiles {
		log.Printf("Checking %s", file.Filename)
		var imgURL *string = nil

		// file must be under 5MB (save storage space for project)
		if file.Size > maxImgSize {
			return 0, errors.New("Images must be under 5MB")
		}
		
		// open file
		opened, _ := file.Open()
		defer opened.Close()

		buff := make([]byte, 512)
		opened.Read(buff)

		fileType := http.DetectContentType(buff)

		if !strings.HasPrefix(fileType, "image/") {
			return 0, errors.New("Only image files are allowed")
		}

		// open file
		opened_second, _ := file.Open()
		defer opened_second.Close()
		
		// create directory
		postIDstr := strconv.FormatUint(uint64(newPost.ID), 10)
		userIDstr := strconv.FormatUint(uint64(user.ID), 10)
		folder := "posts/" + userIDstr + "/" + postIDstr

		log.Printf("Check success. Uploading '%s' to cloudinary...", file.Filename)
		// upload to cloudinary
		upload, err := cloudinary.Cloudinary.Upload.Upload(
			context.Background(),
			opened_second,
			uploader.UploadParams{
				Folder: folder,
				Transformation: "c_fill,w_512,h_512,g_face", // square, face crop
			},
		)

		if err != nil {
			return 0, errors.New("Failed to upload " + file.Filename)
		}

		log.Printf("Uploaded success. Uploaded %s to cloudinary.", file.Filename)
		
		// get image URL
		imgURL = &upload.SecureURL

		log.Printf("Media URL for %s: %s", file.Filename, *imgURL)

		// upload image to DB
		newImage := models.Media{
			MediaURL: *imgURL,
			PostID: newPost.ID,
			UserID: user.ID,
			MediaOrder: i,			
		}

		utils.DebugLog("Record:", newImage)

		if err := s.DB.Create(&newImage).Error; err != nil {
			log.Printf("Failed to add to DB: %s", file.Filename)
			return 0, err
		}

		log.Printf("Added to DB: %s", file.Filename)
	}

	return newPost.ID, nil
}

func (s *PostService) EditPost(postID uint, username, title, content string) error {
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
    var post models.Post
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

	// delete media if have
	var media []models.Media
	if err := s.DB.Where("post_id = ?", postID).Find(&media).Error; err == nil {
		// media record exists: delete records
		if len(media) > 0 {
			// delete media from database
			for _, m := range media {
				if err := s.DB.Delete(&m).Error; err != nil {
					return err
				}

				// delete media from cloudinary
				publicID := utils.ExtractPublicID(m.MediaURL)

				_, err := cloudinary.Cloudinary.Upload.Destroy(
					context.Background(),
					uploader.DestroyParams{
						PublicID: publicID,
					},
				)

				if err != nil {
					return err;
				}
			}
		}
    }

	// decrement post count on topic
	return s.DB.Table("topics").
		Where("id = ? AND post_count > 0", post.Topic).
		Update("post_count", gorm.Expr("post_count - ?", 1)).
		Error
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
		Select("posts.*, users.username, users.pfp, topics.id as topic_id, topics.topic_name, topics.topic_class").
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

	// enrich with media on posts
	if err := s.enrichWithMedia(posts); err != nil {
		return nil, err
	}

	// determine next cursor
	var nextCursor *uint
	if hasMore && len(posts) > 0 {
		lastPostID := posts[len(posts)-1].ID
		nextCursor = &lastPostID
	}

	utils.DebugLog("Posts:", posts)

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
		Select("posts.*, users.username, users.pfp, topics.id as topic_id, topics.topic_name, topics.topic_class").
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

	// enrich with media on posts
	if err := s.enrichWithMedia(posts); err != nil {
		return nil, err
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
		Select(`DISTINCT ON (reposts.post_id, reposts.user_id)
				reposts.post_id, 
				users.username`).
		Joins("JOIN users ON users.id = reposts.user_id").
		Joins("JOIN follows ON follows.following_id = reposts.user_id AND follows.follower_id = ?", currentUserID).
		Where("reposts.post_id IN ?", postIDs).
		Where("reposts.user_id <> ?", currentUserID).
		Order("reposts.post_id, reposts.user_id, reposts.created_at DESC").
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

	return nil
}

func (s *PostService) enrichWithMedia(posts []PostWithTopic) error {
	if len(posts) == 0 {
		return nil
	}

	postIDs := make([]uint, len(posts))
	for i, post := range posts {
		postIDs[i] = post.ID
	}

	type MediaPerPost struct {
		models.Media
		PostID  uint   			  `json:"post_id"`
	}

	var media []MediaPerPost
	s.DB.Table("media").
		Select("media.*, posts.id as post_id").
		Joins("JOIN posts ON posts.id = media.post_id").
		Where("media.post_id IN ?", postIDs).
		Order("media.media_order ASC").
		Find(&media)

	// group media by post ID
	mediaMap := make(map[uint][]string)
	for _, result := range media {
		mediaMap[result.PostID] = append(mediaMap[result.PostID], result.MediaURL)
	}

	for i := range posts {
		postID := posts[i].ID
		posts[i].MediaURLs = mediaMap[postID]
	}

	return nil
}

func sortPostsByScore(posts []PostWithTopic) {
	sort.Slice(posts, func(i, j int) bool {
		return posts[i].Score > posts[j].Score
	})
}