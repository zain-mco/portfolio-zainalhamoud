const express = require('express');
const router = express.Router();
const {
  getAbout,
  updateAbout,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addCertification,
  updateCertification,
  deleteCertification
} = require('../controllers/aboutController');
const { protect } = require('../middleware/auth');

router.get('/', getAbout);
router.put('/', protect, updateAbout);

// Experience routes
router.post('/experience', protect, addExperience);
router.put('/experience/:id', protect, updateExperience);
router.delete('/experience/:id', protect, deleteExperience);

// Education routes
router.post('/education', protect, addEducation);
router.put('/education/:id', protect, updateEducation);
router.delete('/education/:id', protect, deleteEducation);

// Certification routes
router.post('/certification', protect, addCertification);
router.put('/certification/:id', protect, updateCertification);
router.delete('/certification/:id', protect, deleteCertification);

module.exports = router;
