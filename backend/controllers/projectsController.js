const prisma = require('../config/prisma');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

// Helper: format project response
const formatProjectResponse = (project) => ({
  _id: project.id,
  name: project.name,
  description: project.description,
  category: project.category,
  image: project.image,
  projectLink: project.projectLink,
  githubLink: project.githubLink,
  technologies: project.technologies,
  featured: project.featured,
  order: project.order,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;
    let where = {};

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
      data: projects.map(formatProjectResponse)
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
      data: formatProjectResponse(project)
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

    // Parse technologies if it's a string
    let technologies = req.body.technologies;
    if (typeof technologies === 'string') {
      technologies = technologies.split(',').map(t => t.trim()).filter(t => t);
    }

    const project = await prisma.project.create({
      data: {
        ...req.body,
        technologies: technologies || [],
        image: imageUrl
      }
    });

    res.status(201).json({
      success: true,
      data: formatProjectResponse(project)
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

    // Parse technologies if it's a string
    if (typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(t => t.trim()).filter(t => t);
    }

    // If new image is uploaded
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'portfolio/projects');
      updateData.image = result.secure_url;
    }

    // Convert featured to boolean if it's a string
    if (typeof updateData.featured === 'string') {
      updateData.featured = updateData.featured === 'true';
    }

    // Convert order to number if it's a string
    if (typeof updateData.order === 'string') {
      updateData.order = parseInt(updateData.order, 10);
    }

    project = await prisma.project.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.status(200).json({
      success: true,
      data: formatProjectResponse(project)
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
