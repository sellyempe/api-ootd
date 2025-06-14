const express = require('express');
const router = express.Router();
const { logout, getCurrentUser, verifyToken } = require('../controllers/authController');

router.post('/google/verify-token', verifyToken);
router.get('/me', getCurrentUser);
router.post('/logout', logout);

module.exports = router;