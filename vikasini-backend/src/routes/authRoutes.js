const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Registration and login routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.use(authController.protect);

// Update language preference
router.patch('/update-language', authController.updateLanguage);

module.exports = router; 