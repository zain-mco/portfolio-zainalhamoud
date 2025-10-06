const About = require('../models/About');

// @desc    Get about info
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({
        description: 'Default about description',
        workExperience: [],
        education: [],
        certifications: []
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
    let about = await About.findOne();

    if (!about) {
      about = await About.create(req.body);
    } else {
      about = await About.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true
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
    const about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    about.workExperience.push(req.body);
    await about.save();

    res.status(201).json({
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

// @desc    Update work experience
// @route   PUT /api/about/experience/:id
// @access  Private
exports.updateExperience = async (req, res) => {
  try {
    const about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    const experience = about.workExperience.id(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    Object.assign(experience, req.body);
    await about.save();

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

// @desc    Delete work experience
// @route   DELETE /api/about/experience/:id
// @access  Private
exports.deleteExperience = async (req, res) => {
  try {
    const about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    about.workExperience.pull(req.params.id);
    await about.save();

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

// @desc    Add education
// @route   POST /api/about/education
// @access  Private
exports.addEducation = async (req, res) => {
  try {
    const about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    about.education.push(req.body);
    await about.save();

    res.status(201).json({
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

// @desc    Update education
// @route   PUT /api/about/education/:id
// @access  Private
exports.updateEducation = async (req, res) => {
  try {
    const about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    const education = about.education.id(req.params.id);
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }

    Object.assign(education, req.body);
    await about.save();

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

// @desc    Delete education
// @route   DELETE /api/about/education/:id
// @access  Private
exports.deleteEducation = async (req, res) => {
  try {
    const about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    about.education.pull(req.params.id);
    await about.save();

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

// @desc    Add certification
// @route   POST /api/about/certification
// @access  Private
exports.addCertification = async (req, res) => {
  try {
    const about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    about.certifications.push(req.body);
    await about.save();

    res.status(201).json({
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

// @desc    Update certification
// @route   PUT /api/about/certification/:id
// @access  Private
exports.updateCertification = async (req, res) => {
  try {
    const about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    const certification = about.certifications.id(req.params.id);
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    Object.assign(certification, req.body);
    await about.save();

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

// @desc    Delete certification
// @route   DELETE /api/about/certification/:id
// @access  Private
exports.deleteCertification = async (req, res) => {
  try {
    const about = await About.findOne();
    
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    about.certifications.pull(req.params.id);
    await about.save();

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
