## Gossip With Go - API Documentation

### Base URL

```
/api
```

### Health Check

`GET /api/health` - Check server status

### Authentication

| Method | Endpoint                    | Auth Required | Description               |
| ------ | --------------------------- | ------------- | ------------------------- |
| POST   | `/auth/signup`              | No            | Register new user         |
| POST   | `/auth/login`               | No            | User login                |
| POST   | `/auth/logout`              | No            | User logout               |
| POST   | `/auth/verify-email`        | No            | Verify email address      |
| POST   | `/auth/resend-verification` | No            | Resend verification email |
| POST   | `/auth/forgot-password`     | No            | Request password reset    |
| POST   | `/auth/check-reset-token`   | No            | Validate reset token      |
| POST   | `/auth/reset-password`      | No            | Reset password            |
| POST   | `/auth/refresh`             | No            | Refresh access token      |
| GET    | `/auth/me`                  | Yes           | Get current user info     |

### Users

| Method | Endpoint                      | Auth Required | Description           |
| ------ | ----------------------------- | ------------- | --------------------- |
| GET    | `/users/:username`            | Optional      | Get user profile      |
| GET    | `/users/:username/followers`  | No            | Get user's followers  |
| GET    | `/users/:username/followings` | No            | Get user's followings |
| POST   | `/users/edit-profile`         | Yes           | Update user profile   |

### Posts

| Method | Endpoint                         | Auth Required | Description                   |
| ------ | -------------------------------- | ------------- | ----------------------------- |
| GET    | `/posts/topic/:topic`            | Optional      | Get posts by topic            |
| GET    | `/posts/users/:username`         | Optional      | Get user's posts              |
| GET    | `/posts/users/:username/:postID` | Optional      | Get specific user post        |
| GET    | `/posts/trending`                | Optional      | Get trending posts            |
| GET    | `/posts/following`               | Optional      | Get posts from followed users |
| POST   | `/posts/create`                  | Yes           | Create new post               |
| POST   | `/posts/edit`                    | Yes           | Edit existing post            |
| POST   | `/posts/delete/:postID`          | Yes           | Delete post                   |

### Likes

| Method | Endpoint                                | Auth Required | Description                 |
| ------ | --------------------------------------- | ------------- | --------------------------- |
| GET    | `/likes/likers`                         | No            | Get users who liked content |
| GET    | `/likes/status`                         | Yes           | Get like status             |
| POST   | `/likes/toggle`                         | Yes           | Toggle like on content      |
| POST   | `/likes/by_type/:userID/:likeable_type` | Yes           | Get user's likes by type    |

### Reposts

| Method | Endpoint                     | Auth Required | Description              |
| ------ | ---------------------------- | ------------- | ------------------------ |
| GET    | `/reposts/reposters`         | No            | Get users who reposted   |
| GET    | `/reposts/user/:userID`      | Optional      | Get user's reposts       |
| POST   | `/reposts/toggle`            | Yes           | Toggle repost            |
| GET    | `/reposts/status`            | Yes           | Get repost status        |
| POST   | `/reposts/update-visibility` | Yes           | Update repost visibility |

### Comments

| Method | Endpoint                   | Auth Required | Description                |
| ------ | -------------------------- | ------------- | -------------------------- |
| GET    | `/comments/post/:postID`   | Optional      | Get root comments for post |
| GET    | `/comments/:id/replies`    | Optional      | Get comment replies        |
| GET    | `/comments/user/:userID`   | Yes           | Get user's comments        |
| POST   | `/comments/root`           | Yes           | Create root comment        |
| POST   | `/comments/reply`          | Yes           | Create comment reply       |
| GET    | `/comments/toggle-pin/:id` | Yes           | Pin/unpin comment          |
| DELETE | `/comments/:id`            | Yes           | Delete comment             |

### Topics

| Method | Endpoint                  | Auth Required | Description         |
| ------ | ------------------------- | ------------- | ------------------- |
| GET    | `/topics/trending`        | No            | Get trending topics |
| GET    | `/topics/:topicID`        | Optional      | Get topic by ID     |
| POST   | `/topics/create`          | Yes           | Create new topic    |
| POST   | `/topics/delete/:topicID` | Yes           | Delete topic        |

### Follow

| Method | Endpoint         | Auth Required | Description        |
| ------ | ---------------- | ------------- | ------------------ |
| POST   | `/follow/toggle` | Yes           | Toggle follow user |

### Notifications

| Method | Endpoint                               | Auth Required | Description                      |
| ------ | -------------------------------------- | ------------- | -------------------------------- |
| GET    | `/notifications/me`                    | Yes           | Get user notifications           |
| POST   | `/notifications/toggle-view/:notif_id` | Yes           | Mark notification as viewed      |
| POST   | `/notifications/toggle-all-view`       | Yes           | Mark all notifications as viewed |

### Search

| Method | Endpoint | Auth Required | Description    |
| ------ | -------- | ------------- | -------------- |
| GET    | `/query` | No            | Search by type |

### Authentication

- Endpoints marked as **Auth Required: Yes** need a valid authentication token in the request header
- Endpoints marked as **Auth Required: Optional** work with or without authentication but may return different data
