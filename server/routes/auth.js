const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.register);
// Login route
router.post('/login', authController.login);
module.exports = router;
