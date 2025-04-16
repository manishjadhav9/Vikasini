const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// User profile routes
router.get('/me', userController.getMe);
router.patch('/update-me', userController.updateMe);

// Course progress routes
router.get('/my-courses', userController.getMyCourses);
router.post('/enroll/:courseId', userController.enrollCourse);
router.patch('/update-progress/:courseId', userController.updateCourseProgress);

// Job application routes
router.get('/my-applications', userController.getMyApplications);
router.post('/apply/:jobId', userController.applyForJob);

// Admin only routes
router.use(authController.restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.delete('/:id', userController.deleteUser);

module.exports = router; 