const express = require('express');
const router = express.Router();
const { subscribeUser } = require('../controllers/subscriberController');

router.post('/', subscribeUser);

module.exports = router;
