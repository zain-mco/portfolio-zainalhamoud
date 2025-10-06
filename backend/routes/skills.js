const express = require('express');
const router = express.Router();
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  updateAdditionalTech,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
} = require('../controllers/skillsController');
const { protect } = require('../middleware/auth');

// Category routes (must be before /:id routes)
router.get('/categories', getCategories);
router.post('/categories', protect, createCategory);
router.put('/categories/reorder', protect, reorderCategories);
router.put('/categories/:id', protect, updateCategory);
router.delete('/categories/:id', protect, deleteCategory);

// Skill routes
router.get('/', getSkills);
router.post('/', protect, createSkill);
router.put('/reorder', protect, reorderSkills);
router.put('/additional', protect, updateAdditionalTech);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
