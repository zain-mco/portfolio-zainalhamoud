const express = require('express');
const router = express.Router();
const { getPersonal, updatePersonal, uploadProfileImage } = require('../controllers/personalController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getPersonal);
router.put('/', protect, updatePersonal);
router.post('/upload-image', protect, upload.single('image'), uploadProfileImage);

module.exports = router;
