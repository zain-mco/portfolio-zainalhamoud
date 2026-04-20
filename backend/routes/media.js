const express = require('express');
const { getMedia, saveMedia, deleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getMedia)
  .post(protect, saveMedia);

router.route('/:publicId')
  .delete(protect, deleteMedia);

module.exports = router;
