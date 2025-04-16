const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

// Helper function to generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// Create and send token to client
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  
  // Remove password from output
  delete user.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Get user with skills and interests
const getUserWithDetails = async (userId) => {
  // Get basic user information
  const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) return null;
  
  // Remove password from user object
  delete user.password;
  
  // Get user skills
  const skills = await db.all('SELECT name, level FROM skills WHERE user_id = ?', [userId]);
  user.skills = skills;
  
  // Get user interests
  const interestsRows = await db.all('SELECT interest FROM user_interests WHERE user_id = ?', [userId]);
  user.interests = interestsRows.map(row => row.interest);
  
  // Get completed courses
  const completedCourses = await db.all(
    'SELECT course_id FROM user_courses WHERE user_id = ? AND completed = 1', 
    [userId]
  );
  user.completedCourses = completedCourses.map(row => row.course_id);
  
  // Get in-progress courses with progress
  const inProgressCourses = await db.all(
    `SELECT c.id, c.title, uc.progress, uc.last_accessed 
     FROM user_courses uc 
     JOIN courses c ON uc.course_id = c.id 
     WHERE uc.user_id = ? AND uc.completed = 0`,
    [userId]
  );
  user.inProgressCourses = inProgressCourses;
  
  // Get job applications
  const jobApplications = await db.all(
    'SELECT job_id FROM job_applications WHERE user_id = ?',
    [userId]
  );
  user.jobApplications = jobApplications.map(row => row.job_id);
  
  return user;
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, preferredLanguage, role, interests } = req.body;
    
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Insert new user
    const result = await db.run(
      `INSERT INTO users (name, email, password, preferred_language, role)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name, 
        email, 
        hashedPassword, 
        preferredLanguage || 'english',
        role || 'user'
      ]
    );
    
    const userId = result.lastID;
    
    // Add user interests if provided
    if (interests && Array.isArray(interests) && interests.length > 0) {
      for (const interest of interests) {
        await db.run(
          'INSERT INTO user_interests (user_id, interest) VALUES (?, ?)',
          [userId, interest]
        );
      }
    }
    
    // Fetch the user with all related data
    const newUser = await getUserWithDetails(userId);
    
    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // Get user with details and send token
    const userWithDetails = await getUserWithDetails(user.id);
    createSendToken(userWithDetails, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Protect routes middleware
exports.protect = async (req, res, next) => {
  try {
    // Get token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if user still exists
    const currentUser = await db.get('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // Add user details to the request
    req.user = await getUserWithDetails(currentUser.id);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      status: 'fail',
      message: 'Not authorized'
    });
  }
};

// Restrict to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Update user language preference
exports.updateLanguage = async (req, res) => {
  try {
    const { preferredLanguage } = req.body;
    
    if (!preferredLanguage || !['english', 'hindi', 'marathi', 'tamil', 'telugu'].includes(preferredLanguage)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid language'
      });
    }
    
    // Update user's preferred language
    await db.run(
      'UPDATE users SET preferred_language = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [preferredLanguage, req.user.id]
    );
    
    // Get updated user
    const updatedUser = await getUserWithDetails(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Language update error:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}; 