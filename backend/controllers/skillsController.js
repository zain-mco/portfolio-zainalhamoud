const prisma = require('../config/prisma');

// Helper: format skill response
const formatSkillResponse = (skill) => ({
  _id: skill.id,
  name: skill.name,
  percentage: skill.percentage,
  icon: skill.icon,
  category: skill.category,
  order: skill.order,
  createdAt: skill.createdAt,
  updatedAt: skill.updatedAt
});

// Helper: format category response
const formatCategoryResponse = (category) => ({
  _id: category.id,
  name: category.name,
  icon: category.icon,
  order: category.order,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt
});

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
        skills: skills.map(formatSkillResponse),
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
    const data = { ...req.body };
    // Ensure percentage and order are numbers
    if (typeof data.percentage === 'string') data.percentage = parseInt(data.percentage, 10);
    if (typeof data.order === 'string') data.order = parseInt(data.order, 10);

    const skill = await prisma.skill.create({ data });

    res.status(201).json({
      success: true,
      data: formatSkillResponse(skill)
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
    const data = { ...req.body };
    if (typeof data.percentage === 'string') data.percentage = parseInt(data.percentage, 10);
    if (typeof data.order === 'string') data.order = parseInt(data.order, 10);

    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data
    });

    res.status(200).json({
      success: true,
      data: formatSkillResponse(skill)
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
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
    await prisma.skill.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
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
      data: {
        _id: additionalTech.id,
        technologies: additionalTech.technologies,
        createdAt: additionalTech.createdAt,
        updatedAt: additionalTech.updatedAt
      }
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
      data: categories.map(formatCategoryResponse)
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
    const data = { ...req.body };
    if (typeof data.order === 'string') data.order = parseInt(data.order, 10);

    const category = await prisma.skillCategory.create({ data });

    res.status(201).json({
      success: true,
      data: formatCategoryResponse(category)
    });
  } catch (error) {
    // Handle duplicate category name (Prisma unique constraint violation)
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
    const data = { ...req.body };
    if (typeof data.order === 'string') data.order = parseInt(data.order, 10);

    const category = await prisma.skillCategory.update({
      where: { id: req.params.id },
      data
    });

    res.status(200).json({
      success: true,
      data: formatCategoryResponse(category)
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
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
