const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { registerUser, loginUser, getUserProfile, getallusers, updateUserById, deleteUserById } = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Admin-only routes
router.get('/', protect, adminOnly, getallusers);
router.put('/:id', protect, adminOnly, updateUserById);
router.delete('/:id', protect, adminOnly, deleteUserById);

module.exports = router;
