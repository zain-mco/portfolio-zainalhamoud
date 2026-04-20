const prisma = require('../config/prisma');

// @desc    Get contact info
// @route   GET /api/contact
// @access  Public
exports.getContact = async (req, res) => {
  try {
    let contact = await prisma.contact.findFirst({
      include: { socialLinks: true }
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          socialLinks: {
            create: [
              { platform: 'WhatsApp', url: 'https://wa.me/971504235113', icon: 'fab fa-whatsapp' },
              { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/zain-l-alhamoud-5bb414282/', icon: 'fab fa-linkedin' }
            ]
          }
        },
        include: { socialLinks: true }
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update contact info
// @route   PUT /api/contact
// @access  Private
exports.updateContact = async (req, res) => {
  try {
    let contact = await prisma.contact.findFirst();

    const { socialLinks, ...contactData } = req.body;

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          ...contactData,
          socialLinks: socialLinks ? {
            create: socialLinks
          } : undefined
        },
        include: { socialLinks: true }
      });
    } else {
      // Update contact fields
      contact = await prisma.contact.update({
        where: { id: contact.id },
        data: contactData,
        include: { socialLinks: true }
      });

      // If socialLinks provided, replace them
      if (socialLinks) {
        // Delete existing social links
        await prisma.socialLink.deleteMany({
          where: { contactId: contact.id }
        });
        // Create new ones
        await prisma.socialLink.createMany({
          data: socialLinks.map(link => ({
            ...link,
            contactId: contact.id
          }))
        });
        // Refetch with new links
        contact = await prisma.contact.findFirst({
          include: { socialLinks: true }
        });
      }
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit contact message
// @route   POST /api/contact/messages
// @access  Public
exports.submitMessage = async (req, res) => {
  try {
    const message = await prisma.message.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
      }
    });

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all messages
// @route   GET /api/contact/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/messages/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const existing = await prisma.message.findUnique({
      where: { id: req.params.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const message = await prisma.message.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/contact/messages/:id
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const existing = await prisma.message.findUnique({
      where: { id: req.params.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await prisma.message.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
