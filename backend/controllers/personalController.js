const prisma = require('../config/prisma');
const { uploadImage } = require('../utils/cloudinary');

// Helper: format personal response to match MongoDB nested structure
const formatPersonalResponse = (personal) => {
  if (!personal) return null;
  return {
    _id: personal.id,
    name: personal.name,
    title: personal.title,
    bio: personal.bio,
    description: personal.description,
    profileImage: personal.profileImage,
    resumeFile: personal.resumeFile,
    typewriterTexts: personal.typewriterTexts,
    heroStats: {
      projects: personal.statProjects,
      experience: personal.statExperience,
      satisfaction: personal.statSatisfaction
    },
    createdAt: personal.createdAt,
    updatedAt: personal.updatedAt
  };
};

// Helper: extract heroStats from request body into flat columns
const extractPersonalData = (body) => {
  const { heroStats, ...rest } = body;
  const data = { ...rest };
  
  if (heroStats) {
    if (heroStats.projects !== undefined) data.statProjects = heroStats.projects;
    if (heroStats.experience !== undefined) data.statExperience = heroStats.experience;
    if (heroStats.satisfaction !== undefined) data.statSatisfaction = heroStats.satisfaction;
  }
  
  return data;
};

// @desc    Get personal info
// @route   GET /api/personal
// @access  Public
exports.getPersonal = async (req, res) => {
  try {
    let personal = await prisma.personal.findFirst();

    // If no personal info exists, create default
    if (!personal) {
      personal = await prisma.personal.create({
        data: {
          typewriterTexts: ['UI/UX Designer', 'Web Developer', 'Creative Thinker', 'Problem Solver']
        }
      });
    }

    res.status(200).json({
      success: true,
      data: formatPersonalResponse(personal)
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
    let personal = await prisma.personal.findFirst();
    const data = extractPersonalData(req.body);

    if (!personal) {
      personal = await prisma.personal.create({ data });
    } else {
      personal = await prisma.personal.update({
        where: { id: personal.id },
        data
      });
    }

    res.status(200).json({
      success: true,
      data: formatPersonalResponse(personal)
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

    let personal = await prisma.personal.findFirst();
    if (personal) {
      await prisma.personal.update({
        where: { id: personal.id },
        data: { profileImage: result.secure_url }
      });
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
