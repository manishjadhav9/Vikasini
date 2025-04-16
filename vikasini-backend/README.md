# Vikasini Backend with SQLite

This is the backend service for Vikasini, an AI upskilling platform for underprivileged women. The backend handles authentication, user management, course management, job management, and more.

## Technology Stack

- **Node.js**: JavaScript runtime environment
- **Express**: Web framework for Node.js
- **SQLite**: Lightweight, file-based database
- **JWT**: Authentication mechanism
- **bcryptjs**: Password hashing

## Database Structure

The application uses SQLite as a lightweight database with the following tables:

- **users**: User account information
- **skills**: User skills with proficiency levels
- **courses**: Available learning courses
- **user_courses**: Tracks user's progress in courses
- **jobs**: Available job opportunities
- **job_applications**: User's job applications
- **user_interests**: User's areas of interest

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Initialize the database:
   ```
   npm run init-db
   ```
4. Start the server:
   ```
   npm start
   ```

## API Routes

### Authentication

- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Login user
- `PATCH /api/auth/update-language`: Update user language preference (protected)

### User Management

- `GET /api/users/me`: Get current user profile (protected)
- `PATCH /api/users/update-me`: Update user profile (protected)
- `GET /api/users/my-courses`: Get user's courses (protected)
- `POST /api/users/enroll/:courseId`: Enroll in a course (protected)
- `PATCH /api/users/update-progress/:courseId`: Update course progress (protected)
- `GET /api/users/my-applications`: Get user's job applications (protected)
- `POST /api/users/apply/:jobId`: Apply for a job (protected)

### Admin Routes

- `GET /api/users`: Get all users (admin only)
- `GET /api/users/:id`: Get specific user (admin only)
- `DELETE /api/users/:id`: Delete user (admin only)

## Demo Users

The system is initialized with two demo users:

1. **Admin User**
   - Email: admin@vikasini.org
   - Password: admin123
   - Role: admin

2. **Regular User**
   - Email: user@vikasini.org
   - Password: user123
   - Role: user
   - Pre-loaded with some skills and interests 