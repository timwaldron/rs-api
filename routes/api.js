const express = require('express');
const router = express.Router();

// middleware
router.use(express.json())

// routing
router.use('/api', require('./private-routes'))

module.exports = router;