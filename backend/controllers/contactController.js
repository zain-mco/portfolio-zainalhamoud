const prisma = require('../config/prisma');

// Helper: format contact response to match MongoDB nested structure
const formatContactResponse = (contact) => {
  if (!contact) return null;
  return {
    _id: contact.id,
    email: contact.email,
    phone: contact.phone,
    location: contact.location,
    whatsapp: contact.whatsapp,
    socialLinks: (contact.socialLinks || []).map(sl => ({
      _id: sl.id,
      platform: sl.platform,
      url: sl.url,
      icon: sl.icon
    })),
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt
  };
};

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
      data: formatContactResponse(contact)
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
          ...(socialLinks && {
            socialLinks: {
              create: socialLinks
            }
          })
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

      // If socialLinks are provided, replace them
      if (socialLinks) {
        // Delete existing social links
        await prisma.socialLink.deleteMany({
          where: { contactId: contact.id }
        });

        // Create new social links
        await prisma.socialLink.createMany({
          data: socialLinks.map(sl => ({
            ...sl,
            contactId: contact.id
          }))
        });

        // Refetch with updated links
        contact = await prisma.contact.findFirst({
          include: { socialLinks: true }
        });
      }
    }

    res.status(200).json({
      success: true,
      data: formatContactResponse(contact)
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
      data: req.body
    });

    res.status(201).json({
      success: true,
      data: {
        _id: message.id,
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        isRead: message.isRead,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
      },
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
      data: messages.map(m => ({
        _id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        isRead: m.isRead,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
      }))
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
    const message = await prisma.message.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    res.status(200).json({
      success: true,
      data: {
        _id: message.id,
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        isRead: message.isRead,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
      }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
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
    await prisma.message.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
