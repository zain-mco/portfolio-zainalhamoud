const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  uploadProjectImage
} = require('../controllers/projectsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', protect, upload.single('image'), createProject);
router.put('/reorder', protect, reorderProjects);
router.post('/upload', protect, upload.single('image'), uploadProjectImage);
router.put('/:id', protect, upload.single('image'), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
