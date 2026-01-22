# CHANGELOG

All notable changes to this project will be documented in this file.
Check out the full release notes [here](https://github.com/ikeawesom/gossip-with-go/releases).

---

## v1.5.0 - 20 Jan 2026

### Added

- User profile enhancements with improved metadata handling
- Post deletion confirmation flow for safer interactions
- Additional utility helpers for string and state management

### Changed

- Refined UI spacing and typography for improved readability
- Improved navigation behaviour across authenticated routes
- Better error handling for client-side API requests

### Fixed

- Edge case where deleted posts could still appear in feeds
- Minor layout inconsistencies on smaller screens

---

## v1.4.0 - 12 Jan 2026

### Added

- Progressive Web App (PWA) support:
  - Installable app experience
  - Install prompts across Trending and Following pages
- Email verification flag to improve account integrity
- Ability for post owners to delete comments
- Updated application icon

### Changed

- Reduced text size for better readability
- UI refinements for modals and prompts
- Improved mobile and tablet responsiveness

---

## v1.3.0 - 9 Jan 2026

### Added

- Following page
- Footer section
- Automatic reload on sign-out
- Utility Auth Buttons component
- String trimming helper utility

### Changed

- Major responsive design improvements across the app
- Improved navigation UX (auto-close modals on route change)
- Home page redirect handling
- UI cleanup:
  - Removed admin label
  - Removed unnecessary bold styles
  - Removed debug outlines

### Fixed

- Topic query bug
- Liked replies display issue
- Replies visibility bug
- Cookie handling issues affecting signing out

---

## v1.2.0 3 Jan 2026

### Added

- Topics system:
  - Create topics
  - Topic-based browsing
  - Assigned icons for topics
- Utility section for:
  - Create Post
  - Create Topic
- Frontend API handlers for topic routes

### Changed

- Improved horizontal scrolling for trending topics
- Increased post content size for better readability
- Improved icon handling and layout spacing

### Fixed

- Topic ID parsing bug
- Removed redundant topic-related interfaces

---

## v1.1.0 - 31 Dec 2025

### Added

- Full commenting system:
  - Root comments
  - Two-level nested replies
- Comment actions:
  - Reply buttons
  - Delete buttons
  - Settings menu
- Optional authentication for replies
- User metadata enhancements:
  - Username display
  - Like status indicators

### Changed

- Reduced textarea padding
- Improved time formatting
- Added hover effects for links
- Improved pagination cursor handling

### Fixed

- Duplicate posts issue
- Reply section visibility issues
- Cleaned up redundant imports and props

---

## v1.0.0 - 27 Dec 2025

### Added

- Core posting system:
  - Create, update, and delete posts
  - Authenticated routes for post management
- Utility modal system
- Spinner customisation
- Smart content wrapping
- Topic icon system
- Frontend API handlers for posts and comments
- Delete-post workflow

### Infrastructure

- Fly.io deployment support:
  - Docker configuration
  - `fly.toml` setup
  - Automated launch files

### Changed

- Added main background gradient
- Improved date display logic
- UI improvements across buttons, icons, and layouts
