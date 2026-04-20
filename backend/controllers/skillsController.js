const prisma = require('../config/prisma');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' }
    });

    const additionalTech = await prisma.additionalTech.findFirst();

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
    const skill = await prisma.skill.create({
      data: {
        name: req.body.name,
        percentage: parseInt(req.body.percentage),
        icon: req.body.icon,
        category: req.body.category,
        order: parseInt(req.body.order) || 0
      }
    });

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
    const existing = await prisma.skill.findUnique({
      where: { id: req.params.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const updateData = { ...req.body };
    if (updateData.percentage !== undefined) {
      updateData.percentage = parseInt(updateData.percentage);
    }
    if (updateData.order !== undefined) {
      updateData.order = parseInt(updateData.order);
    }

    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data: updateData
    });

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
    const existing = await prisma.skill.findUnique({
      where: { id: req.params.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    await prisma.skill.delete({
      where: { id: req.params.id }
    });

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

    await prisma.$transaction(
      skills.map(skill =>
        prisma.skill.update({
          where: { id: skill.id },
          data: { order: skill.order }
        })
      )
    );

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
    let additionalTech = await prisma.additionalTech.findFirst();

    if (!additionalTech) {
      additionalTech = await prisma.additionalTech.create({
        data: { technologies: req.body.technologies || [] }
      });
    } else {
      additionalTech = await prisma.additionalTech.update({
        where: { id: additionalTech.id },
        data: { technologies: req.body.technologies || [] }
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
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' }
    });

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
    const category = await prisma.skillCategory.create({
      data: {
        name: req.body.name,
        icon: req.body.icon || 'fas fa-code',
        order: parseInt(req.body.order) || 0
      }
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle duplicate category name
    if (error.code === 'P2002') {
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
    const existing = await prisma.skillCategory.findUnique({
      where: { id: req.params.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const updateData = { ...req.body };
    if (updateData.order !== undefined) {
      updateData.order = parseInt(updateData.order);
    }

    const category = await prisma.skillCategory.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle duplicate category name
    if (error.code === 'P2002') {
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
    const category = await prisma.skillCategory.findUnique({
      where: { id: req.params.id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if any skills are using this category
    const skillsCount = await prisma.skill.count({
      where: { category: category.name }
    });
    
    if (skillsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${skillsCount} skill(s) are using this category. Please reassign or delete them first.`
      });
    }

    await prisma.skillCategory.delete({
      where: { id: req.params.id }
    });

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

    await prisma.$transaction(
      categories.map(category =>
        prisma.skillCategory.update({
          where: { id: category.id },
          data: { order: category.order }
        })
      )
    );

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
