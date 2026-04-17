const prisma = require('../config/prisma');

// Helper: format about response to match MongoDB nested structure
const formatAboutResponse = (about) => {
  if (!about) return null;
  return {
    _id: about.id,
    description: about.description,
    workExperience: (about.workExperience || []).map(we => ({
      _id: we.id,
      title: we.title,
      company: we.company,
      duration: we.duration,
      location: we.location,
      responsibilities: we.responsibilities,
      order: we.order
    })),
    education: (about.education || []).map(ed => ({
      _id: ed.id,
      degree: ed.degree,
      institution: ed.institution,
      duration: ed.duration,
      description: ed.description,
      order: ed.order
    })),
    certifications: (about.certifications || []).map(cert => ({
      _id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      link: cert.link,
      image: cert.image
    })),
    createdAt: about.createdAt,
    updatedAt: about.updatedAt
  };
};

const includeAll = {
  workExperience: { orderBy: { order: 'asc' } },
  education: { orderBy: { order: 'asc' } },
  certifications: true
};

// @desc    Get about info
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res) => {
  try {
    let about = await prisma.about.findFirst({ include: includeAll });

    if (!about) {
      about = await prisma.about.create({
        data: {
          description: 'Default about description',
        },
        include: includeAll
      });
    }

    res.status(200).json({
      success: true,
      data: formatAboutResponse(about)
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
    const { description } = req.body;

    if (!about) {
      about = await prisma.about.create({
        data: { description: description || 'Default about description' },
        include: includeAll
      });
    } else {
      about = await prisma.about.update({
        where: { id: about.id },
        data: { description },
        include: includeAll
      });
    }

    res.status(200).json({
      success: true,
      data: formatAboutResponse(about)
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
        ...req.body,
        aboutId: about.id
      }
    });

    const updated = await prisma.about.findFirst({ include: includeAll });

    res.status(201).json({
      success: true,
      data: formatAboutResponse(updated)
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
    const about = await prisma.about.findFirst();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    const experience = await prisma.workExperience.findUnique({
      where: { id: req.params.id }
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    await prisma.workExperience.update({
      where: { id: req.params.id },
      data: req.body
    });

    const updated = await prisma.about.findFirst({ include: includeAll });

    res.status(200).json({
      success: true,
      data: formatAboutResponse(updated)
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
    const about = await prisma.about.findFirst();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    await prisma.workExperience.delete({
      where: { id: req.params.id }
    });

    const updated = await prisma.about.findFirst({ include: includeAll });

    res.status(200).json({
      success: true,
      data: formatAboutResponse(updated)
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
        ...req.body,
        aboutId: about.id
      }
    });

    const updated = await prisma.about.findFirst({ include: includeAll });

    res.status(201).json({
      success: true,
      data: formatAboutResponse(updated)
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
    const about = await prisma.about.findFirst();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    const education = await prisma.education.findUnique({
      where: { id: req.params.id }
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }

    await prisma.education.update({
      where: { id: req.params.id },
      data: req.body
    });

    const updated = await prisma.about.findFirst({ include: includeAll });

    res.status(200).json({
      success: true,
      data: formatAboutResponse(updated)
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
    const about = await prisma.about.findFirst();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    await prisma.education.delete({
      where: { id: req.params.id }
    });

    const updated = await prisma.about.findFirst({ include: includeAll });

    res.status(200).json({
      success: true,
      data: formatAboutResponse(updated)
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
        ...req.body,
        aboutId: about.id
      }
    });

    const updated = await prisma.about.findFirst({ include: includeAll });

    res.status(201).json({
      success: true,
      data: formatAboutResponse(updated)
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
    const about = await prisma.about.findFirst();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    const certification = await prisma.certification.findUnique({
      where: { id: req.params.id }
    });

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    await prisma.certification.update({
      where: { id: req.params.id },
      data: req.body
    });

    const updated = await prisma.about.findFirst({ include: includeAll });

    res.status(200).json({
      success: true,
      data: formatAboutResponse(updated)
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
    const about = await prisma.about.findFirst();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    await prisma.certification.delete({
      where: { id: req.params.id }
    });

    const updated = await prisma.about.findFirst({ include: includeAll });

    res.status(200).json({
      success: true,
      data: formatAboutResponse(updated)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
