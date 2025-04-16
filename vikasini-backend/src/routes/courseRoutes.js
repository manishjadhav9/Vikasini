const express = require('express');
const authController = require('../controllers/authController');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourse);

// Protected routes
router.use(authController.protect);

// Course lesson routes
router.get('/:id/lessons', courseController.getCourseLessons);
router.get('/:courseId/lessons/:lessonId', courseController.getCourseLesson);

// Admin only routes
router.use(authController.restrictTo('admin'));
router.post('/', courseController.createCourse);
router.patch('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Lesson management routes
router.post('/:id/lessons', courseController.addLesson);
router.patch('/:courseId/lessons/:lessonId', courseController.updateLesson);
router.delete('/:courseId/lessons/:lessonId', courseController.deleteLesson);

module.exports = router; 