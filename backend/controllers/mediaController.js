const prisma = require('../config/prisma');

// @desc    Get all media
// @route   GET /api/media
// @access  Private
exports.getMedia = async (req, res) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Save new media
// @route   POST /api/media
// @access  Private
exports.saveMedia = async (req, res) => {
  try {
    const { url, publicId, folder } = req.body;

    if (!url || !publicId) {
      return res.status(400).json({
        success: false,
        message: 'Must provide url and publicId'
      });
    }

    // Check if media already exists to avoid duplicates
    let media = await prisma.media.findUnique({
      where: { publicId }
    });

    if (!media) {
      media = await prisma.media.create({
        data: {
          url,
          publicId,
          folder: folder || 'portfolio'
        }
      });
    }

    res.status(201).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete media
// @route   DELETE /api/media/:publicId
// @access  Private
exports.deleteMedia = async (req, res) => {
  try {
    // Note: To completely delete, you would also call Cloudinary's destroy endpoint.
    // For now, we only delete from database registry.
    const { publicId } = req.params;

    const decodedId = decodeURIComponent(publicId);

    const media = await prisma.media.delete({
      where: { publicId: decodedId }
    });

    res.status(200).json({
      success: true,
      data: media,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
