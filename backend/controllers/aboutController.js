const prisma = require('../config/prisma');

// Helper: include all relations
const aboutIncludes = {
  workExperience: { orderBy: { order: 'asc' } },
  education: { orderBy: { order: 'asc' } },
  certifications: true
};

// @desc    Get about info
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res) => {
  try {
    let about = await prisma.about.findFirst({
      include: aboutIncludes
    });

    if (!about) {
      about = await prisma.about.create({
        data: {
          description: 'Default about description'
        },
        include: aboutIncludes
      });
    }

    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update about info
// @route   PUT /api/about
// @access  Private
exports.updateAbout = async (req, res) => {
  try {
    let about = await prisma.about.findFirst();

    if (!about) {
      about = await prisma.about.create({
        data: {
          description: req.body.description || 'Default about description'
        },
        include: aboutIncludes
      });
    } else {
      about = await prisma.about.update({
        where: { id: about.id },
        data: {
          description: req.body.description
        },
        include: aboutIncludes
      });
    }

    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add work experience
// @route   POST /api/about/experience
// @access  Private
exports.addExperience = async (req, res) => {
  try {
    const about = await prisma.about.findFirst();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    await prisma.workExperience.create({
      data: {
        title: req.body.title,
        company: req.body.company,
        duration: req.body.duration,
        location: req.body.location,
        responsibilities: req.body.responsibilities || [],
        order: parseInt(req.body.order) || 0,
        aboutId: about.id
      }
    });

    // Return full about with relations
    const updatedAbout = await prisma.about.findFirst({
      include: aboutIncludes
    });

    res.status(201).json({
      success: true,
      data: updatedAbout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update work experience
// @route   PUT /api/about/experience/:id
// @access  Private
exports.updateExperience = async (req, res) => {
  try {
    const experience = await prisma.workExperience.findUnique({
      where: { id: req.params.id }
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    const updateData = { ...req.body };
    if (updateData.order !== undefined) {
      updateData.order = parseInt(updateData.order);
    }
    // Don't allow changing aboutId
    delete updateData.aboutId;

    await prisma.workExperience.update({
      where: { id: req.params.id },
      data: updateData
    });

    const updatedAbout = await prisma.about.findFirst({
      include: aboutIncludes
    });

    res.status(200).json({
      success: true,
      data: updatedAbout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete work experience
// @route   DELETE /api/about/experience/:id
// @access  Private
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await prisma.workExperience.findUnique({
      where: { id: req.params.id }
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    await prisma.workExperience.delete({
      where: { id: req.params.id }
    });

    const updatedAbout = await prisma.about.findFirst({
      include: aboutIncludes
    });

    res.status(200).json({
      success: true,
      data: updatedAbout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add education
// @route   POST /api/about/education
// @access  Private
exports.addEducation = async (req, res) => {
  try {
    const about = await prisma.about.findFirst();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    await prisma.education.create({
      data: {
        degree: req.body.degree,
        institution: req.body.institution,
        duration: req.body.duration,
        description: req.body.description || null,
        order: parseInt(req.body.order) || 0,
        aboutId: about.id
      }
    });

    const updatedAbout = await prisma.about.findFirst({
      include: aboutIncludes
    });

    res.status(201).json({
      success: true,
      data: updatedAbout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update education
// @route   PUT /api/about/education/:id
// @access  Private
exports.updateEducation = async (req, res) => {
  try {
    const education = await prisma.education.findUnique({
      where: { id: req.params.id }
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }

    const updateData = { ...req.body };
    if (updateData.order !== undefined) {
      updateData.order = parseInt(updateData.order);
    }
    delete updateData.aboutId;

    await prisma.education.update({
      where: { id: req.params.id },
      data: updateData
    });

    const updatedAbout = await prisma.about.findFirst({
      include: aboutIncludes
    });

    res.status(200).json({
      success: true,
      data: updatedAbout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete education
// @route   DELETE /api/about/education/:id
// @access  Private
exports.deleteEducation = async (req, res) => {
  try {
    const education = await prisma.education.findUnique({
      where: { id: req.params.id }
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }

    await prisma.education.delete({
      where: { id: req.params.id }
    });

    const updatedAbout = await prisma.about.findFirst({
      include: aboutIncludes
    });

    res.status(200).json({
      success: true,
      data: updatedAbout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add certification
// @route   POST /api/about/certification
// @access  Private
exports.addCertification = async (req, res) => {
  try {
    const about = await prisma.about.findFirst();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    await prisma.certification.create({
      data: {
        name: req.body.name,
        issuer: req.body.issuer,
        link: req.body.link || null,
        image: req.body.image || null,
        aboutId: about.id
      }
    });

    const updatedAbout = await prisma.about.findFirst({
      include: aboutIncludes
    });

    res.status(201).json({
      success: true,
      data: updatedAbout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update certification
// @route   PUT /api/about/certification/:id
// @access  Private
exports.updateCertification = async (req, res) => {
  try {
    const certification = await prisma.certification.findUnique({
      where: { id: req.params.id }
    });

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    const updateData = { ...req.body };
    delete updateData.aboutId;

    await prisma.certification.update({
      where: { id: req.params.id },
      data: updateData
    });

    const updatedAbout = await prisma.about.findFirst({
      include: aboutIncludes
    });

    res.status(200).json({
      success: true,
      data: updatedAbout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete certification
// @route   DELETE /api/about/certification/:id
// @access  Private
exports.deleteCertification = async (req, res) => {
  try {
    const certification = await prisma.certification.findUnique({
      where: { id: req.params.id }
    });

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    await prisma.certification.delete({
      where: { id: req.params.id }
    });

    const updatedAbout = await prisma.about.findFirst({
      include: aboutIncludes
    });

    res.status(200).json({
      success: true,
      data: updatedAbout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
