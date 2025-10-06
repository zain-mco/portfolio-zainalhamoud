const { SkillCategory, Skill, AdditionalTech } = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    const additionalTech = await AdditionalTech.findOne();

    res.status(200).json({
      success: true,
      data: {
        skills,
        additionalTechnologies: additionalTech ? additionalTech.technologies : []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
exports.createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reorder skills
// @route   PUT /api/skills/reorder
// @access  Private
exports.reorderSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    const bulkOps = skills.map(skill => ({
      updateOne: {
        filter: { _id: skill.id },
        update: { order: skill.order }
      }
    }));

    await Skill.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Skills reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update additional technologies
// @route   PUT /api/skills/additional
// @access  Private
exports.updateAdditionalTech = async (req, res) => {
  try {
    let additionalTech = await AdditionalTech.findOne();

    if (!additionalTech) {
      additionalTech = await AdditionalTech.create(req.body);
    } else {
      additionalTech = await AdditionalTech.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      data: additionalTech
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ CATEGORY MANAGEMENT ============

// @desc    Get all skill categories
// @route   GET /api/skills/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await SkillCategory.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create skill category
// @route   POST /api/skills/categories
// @access  Private
exports.createCategory = async (req, res) => {
  try {
    const category = await SkillCategory.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle duplicate category name
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update skill category
// @route   PUT /api/skills/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    const category = await SkillCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle duplicate category name
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete skill category
// @route   DELETE /api/skills/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    const category = await SkillCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if any skills are using this category
    const skillsCount = await Skill.countDocuments({ category: category.name });
    
    if (skillsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${skillsCount} skill(s) are using this category. Please reassign or delete them first.`
      });
    }

    await SkillCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reorder categories
// @route   PUT /api/skills/categories/reorder
// @access  Private
exports.reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    const bulkOps = categories.map(category => ({
      updateOne: {
        filter: { _id: category.id },
        update: { order: category.order }
      }
    }));

    await SkillCategory.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Categories reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
