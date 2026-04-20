const prisma = require('../config/prisma');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const where = {};

    if (category) {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    let imageUrl = req.body.image;

    // If image file is uploaded
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'portfolio/projects');
      imageUrl = result.secure_url;
    }

    // Ensure technologies is stored as JSON array
    let technologies = req.body.technologies;
    if (typeof technologies === 'string') {
      try {
        technologies = JSON.parse(technologies);
      } catch {
        technologies = technologies.split(',').map(t => t.trim());
      }
    }

    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        image: imageUrl,
        projectLink: req.body.projectLink,
        githubLink: req.body.githubLink || '',
        technologies: technologies || [],
        featured: req.body.featured === true || req.body.featured === 'true',
        order: parseInt(req.body.order) || 0
      }
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    let updateData = { ...req.body };

    // If new image is uploaded
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'portfolio/projects');
      updateData.image = result.secure_url;
    }

    // Ensure technologies is stored as JSON array
    if (updateData.technologies && typeof updateData.technologies === 'string') {
      try {
        updateData.technologies = JSON.parse(updateData.technologies);
      } catch {
        updateData.technologies = updateData.technologies.split(',').map(t => t.trim());
      }
    }

    // Parse boolean and integer fields
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === true || updateData.featured === 'true';
    }
    if (updateData.order !== undefined) {
      updateData.order = parseInt(updateData.order) || 0;
    }

    project = await prisma.project.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await prisma.project.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reorder projects
// @route   PUT /api/projects/reorder
// @access  Private
exports.reorderProjects = async (req, res) => {
  try {
    const { projects } = req.body; // Array of { id, order }

    await prisma.$transaction(
      projects.map(project =>
        prisma.project.update({
          where: { id: project.id },
          data: { order: project.order }
        })
      )
    );

    res.status(200).json({
      success: true,
      message: 'Projects reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload project image
// @route   POST /api/projects/upload
// @access  Private
exports.uploadProjectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const result = await uploadImage(req.file.buffer, 'portfolio/projects');

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
