const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/adminSettingsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;
