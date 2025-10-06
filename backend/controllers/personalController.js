const Personal = require('../models/Personal');
const { uploadImage } = require('../utils/cloudinary');

// @desc    Get personal info
// @route   GET /api/personal
// @access  Public
exports.getPersonal = async (req, res) => {
  try {
    let personal = await Personal.findOne();

    // If no personal info exists, create default
    if (!personal) {
      personal = await Personal.create({
        typewriterTexts: ['UI/UX Designer', 'Web Developer', 'Creative Thinker', 'Problem Solver']
      });
    }

    res.status(200).json({
      success: true,
      data: personal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update personal info
// @route   PUT /api/personal
// @access  Private
exports.updatePersonal = async (req, res) => {
  try {
    let personal = await Personal.findOne();

    if (!personal) {
      personal = await Personal.create(req.body);
    } else {
      personal = await Personal.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      data: personal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload profile image
// @route   POST /api/personal/upload-image
// @access  Private
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const result = await uploadImage(req.file.buffer, 'portfolio/profile');

    let personal = await Personal.findOne();
    if (personal) {
      personal.profileImage = result.secure_url;
      await personal.save();
    }

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
