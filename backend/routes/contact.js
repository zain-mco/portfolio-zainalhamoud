const express = require('express');
const router = express.Router();
const {
  getContact,
  updateContact,
  submitMessage,
  getMessages,
  markAsRead,
  deleteMessage
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.get('/', getContact);
router.put('/', protect, updateContact);

// Messages routes
router.post('/messages', submitMessage);
router.get('/messages', protect, getMessages);
router.put('/messages/:id/read', protect, markAsRead);
router.delete('/messages/:id', protect, deleteMessage);

module.exports = router;
