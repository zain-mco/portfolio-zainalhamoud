const express = require('express');
const router = express.Router();
const { trackVisitor, getVisitorStats, getRecentVisitors } = require('../controllers/visitorController');
const { protect } = require('../middleware/auth');

// Public route - track visitor
router.post('/track', trackVisitor);

// Protected routes - admin only
router.get('/stats', protect, getVisitorStats);
router.get('/recent', protect, getRecentVisitors);

module.exports = router;
