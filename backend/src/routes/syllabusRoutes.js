const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { createSyllabus, getAllSyllabus, getSyllabusById, deleteSyllabus, updateSyllabus } = require('../controllers/syllabusController');

router.get('/', getAllSyllabus);
router.get('/:id', getSyllabusById);
router.post('/', protect, adminOnly, upload.single('file'), createSyllabus);
router.put('/:id', protect, adminOnly, upload.single('file'), updateSyllabus);
router.delete('/:id', protect, adminOnly, deleteSyllabus);

module.exports = router;
