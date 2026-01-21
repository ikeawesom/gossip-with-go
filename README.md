<img src="frontend/public/favicon.svg" alt="icon" width="100"/>

# Gossip With Go

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Go Version](https://img.shields.io/badge/go-1.25.5-blue)
![React](https://img.shields.io/badge/react-19.2-blue)

Welcome to **Gossip With Go**! My name is Ike and I have built this modern and responsive web application designed to facilitate meaningful discussions through posts, topics, and nested comments! Discover content via topic-based categorisation and fellow users for interaction. It is designed to resemble the interaction patterns of modern social platforms such as Instagram and Reddit, while remaining lightweight, performant and developer-friendly.

Check out the deployment [here](https://go-gossip.vercel.app)!

## Highlighted Features

👤 Create new accounts as Gossipers

✍️ Create, edit, and delete posts

❤️ **Interact** with posts with likes, comments and reposts

💬 Comment on posts with up to two levels of **nested replies**

📖 Topic creation and topic-based browsing

✅ **Progressive Web App** (PWA) support:

- ⬇️ Installable experience
- 📶 Offline access to cached content

📱 **Responsive UI** optimised for desktop and mobile devices

## Tech Stack

### Frontend

- React + TypeScript
- TailwindCSS for styling
- Deployed on [Vercel](https://vercel.com)

### Backend

- Go
- Gin for API Handling
- Deployed on [Fly.io](https://fly.io/)

### Infrastructure

- Docker
- Git
- Neon PostgreSQL for database
- Cloudinary Storage Buckets

## Setup & Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (v24+ recommended)
- Go (v1.25+ recommended)
- Docker (optional, for deployment)
- Git

1. Clone this repository

```git
git clone https://github.com/ikeawesom/gossip-with-go.git gossip-with-go
```

2. Local Development

### Backend

```bash
cd backend
go run main.go
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The application should now be running locally.

## Environment Variables

Create a `.env` in `backend`:

```bash
# server config
PORT=8080
GIN_MODE=debug  # change to "release" for production

# Database (I am using Neon PostgreSQL for production case)
DATABASE_URL=

# Storage (I am using Cloudinary storage buckets)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# JWT Configuration (CAN MODIFY)
JWT_SECRET=
JWT_ACCESS_TOKEN_EXPIRY=1h      # 60 mins
JWT_REFRESH_TOKEN_EXPIRY=720h    # 30 days (30 * 24h)

# Cookie Configuration
COOKIE_DOMAIN=localhost          # Modify domain in production
COOKIE_SECURE=true               # Set to true in production (requires HTTPS)
COOKIE_SAME_SITE=None             # Lax or None (None requires Secure=true)

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (I am using Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
EMAIL_FROM=
EMAIL_FROM_NAME=Gossip With Go

# Email verification & password reset URLs (MODIFY DOMAIN IN PRODUCTION)
FRONTEND_VERIFY_EMAIL_URL=http://localhost:5173/auth/register
FRONTEND_RESET_PASSWORD_URL=http://localhost:5173/auth/forgot-password
```

As this project uses same-site cookies, no **frontend** `.env` files are required for API URLs.

## Security

✅ JWT authentication with httpOnly cookies

✅ CORS and XSS protection

✅ Rate limiting on API endpoints

✅ Input validation

✅ Bcrypt password hashing

## API Documentation

### Base URL

```
/api
```

### Important Endpoints

| Method   | Endpoint  | Auth Required   | Description                       |
| -------- | --------- | --------------- | --------------------------------- |
| GET      | `/health` | No              | Check server status               |
| GET/POST | `/auth`   | Yes/No          | Authentication Endpoint           |
| GET/POST | `/users`  | Yes/No/Optional | Fetch data from users             |
| GET/POST | `/posts`  | Yes/Optional    | Fetch data from posts             |
| GET/POST | `/search` | No              | Search posts/users/topics by type |

_View the full API docs [here](https://github.com/ikeawesom/gossip-with-go/blob/main/backend/internal/routes/API.md)_.

## AI Usage Documentation

### Architecture

Deployment and setting up project architecture is vital, hence I used AI to guide me on suggestions and why so. This was to aid me in weighing the pros and cons of certain frameworks and systems and decide what is best for the project.

```
I am building a web application with React + TypeScript and Go.
Give me a list of 5 deployment options for both frontend and backend,
along with their descriptions, pros and cons in a table format.
```

### Go

As I am a beginner in Go, I used AI to explain to me the basics of Go, along with its similarities with other languages I am familiar with (e.g. Python, JavaScript, etc.)

```
I am a beginner in Go and I want to learn more about this lanuage.
Explain in detail, what are the basic functionality and syntax of Go?
I am well-versed in Python and JavaScript, you may use these lanugages as reference in your explanation.
```

### JWT-Cookies

It is first time developing authenticaion using JWT cookies, so using AI to teach me more about the lifecycle of such authentication was beneificial for me.

```
For my web application, I am using JWT cookies for authentication. Explain to me the process
of authentication of JWT cookies from user to database and back to the user.
```

### Development

The usage of AI was efficient in developing test and dummy data for my database (e.g. fake users, fake posts, etc.).

```
I want some dummy data for my application.
Here is my table schema for users.
...
Generate for me an array of 10 dummy users.
```

### Feedback

I used AI to review some of my code with complex logic to figure out any loopholes or edge cases I might need to reconsider.

```
Here is a code snippet of my React component. Give me a review on it and
constructive feedback to improve my code in terms of functionality,
efficiency and readability.
```

## Acknowledgments

- UI inspired by Reddit, Instragram and Facebook
- Icons from [IconScout](https://iconscout.com)
- Hosted on [Vercel](https://vercel.com) and [Fly.io](https://fly.io)
- Database by [Neon](https://neon.tech)
- Storage buckets by [Cloudinary](https://cloudinary.com)

## Contact

**Developer**: Ike Lim

- GitHub: [@ikeawesom](https://github.com/ikeawesom)
- LinkedIn: [Ike Lim](https://www.linkedin.com/in/ike-lim)
- Email: ikebusinessoff@gmail.com

**Project Link**: [https://github.com/ikeawesom/gossip-with-go](https://github.com/ikeawesom/gossip-with-go)
