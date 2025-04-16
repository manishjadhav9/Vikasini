const express = require('express');
const authController = require('../controllers/authController');
const jobController = require('../controllers/jobController');

const router = express.Router();

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJob);

// Protected routes
router.use(authController.protect);

// Job matching
router.get('/match/user', jobController.getMatchingJobs);

// Admin only routes
router.use(authController.restrictTo('admin'));
router.post('/', jobController.createJob);
router.patch('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router; 