const express = require('express');
const router = express.Router();
const {
    createPYQ,
    getAllPYQs,
    getPYQById,
    updatePYQ,
    deletePYQ,
} = require('../controllers/pyqController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPYQs);
router.get('/:id', getPYQById);

const upload = require('../middleware/uploadMiddleware');

// Protected routes
router.post('/', protect, adminOnly, upload.single('file'), createPYQ);
router.put('/:id', protect, adminOnly, upload.single('file'), updatePYQ);
router.delete('/:id', protect, adminOnly, deletePYQ);

module.exports = router;
