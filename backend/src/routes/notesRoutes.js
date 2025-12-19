const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    createNotes,
    getAllNotes,
    getNotesById,
    deleteNote,
    updateNotes
} = require('../controllers/notesController');

router.get('/', getAllNotes);

router.get('/:id', getNotesById);

router.post('/', protect, adminOnly, upload.single('file'), createNotes);
router.put('/:id', protect, adminOnly, upload.single('file'), updateNotes);
router.delete('/:id', protect, adminOnly, deleteNote);

module.exports = router;
