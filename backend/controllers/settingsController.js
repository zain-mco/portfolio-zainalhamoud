const prisma = require('../config/prisma');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {}
      });
    }

    // Transform flat columns back to nested structure for API compatibility
    const data = {
      _id: settings.id,
      theme: {
        primaryColor: settings.themePrimaryColor,
        secondaryColor: settings.themeSecondaryColor,
        accentColor: settings.themeAccentColor
      },
      seo: {
        title: settings.seoTitle,
        description: settings.seoDescription,
        keywords: settings.seoKeywords,
        ogImage: settings.seoOgImage
      },
      analytics: {
        googleAnalyticsId: settings.googleAnalyticsId
      },
      maintenanceMode: settings.maintenanceMode,
      customCSS: settings.customCSS,
      customJS: settings.customJS,
      footerText: settings.footerText,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();

    // Flatten nested objects from the request body
    const updateData = {};
    
    if (req.body.theme) {
      if (req.body.theme.primaryColor !== undefined) updateData.themePrimaryColor = req.body.theme.primaryColor;
      if (req.body.theme.secondaryColor !== undefined) updateData.themeSecondaryColor = req.body.theme.secondaryColor;
      if (req.body.theme.accentColor !== undefined) updateData.themeAccentColor = req.body.theme.accentColor;
    }
    
    if (req.body.seo) {
      if (req.body.seo.title !== undefined) updateData.seoTitle = req.body.seo.title;
      if (req.body.seo.description !== undefined) updateData.seoDescription = req.body.seo.description;
      if (req.body.seo.keywords !== undefined) updateData.seoKeywords = req.body.seo.keywords;
      if (req.body.seo.ogImage !== undefined) updateData.seoOgImage = req.body.seo.ogImage;
    }
    
    if (req.body.analytics) {
      if (req.body.analytics.googleAnalyticsId !== undefined) updateData.googleAnalyticsId = req.body.analytics.googleAnalyticsId;
    }

    if (req.body.maintenanceMode !== undefined) updateData.maintenanceMode = req.body.maintenanceMode;
    if (req.body.customCSS !== undefined) updateData.customCSS = req.body.customCSS;
    if (req.body.customJS !== undefined) updateData.customJS = req.body.customJS;
    if (req.body.footerText !== undefined) updateData.footerText = req.body.footerText;

    if (!settings) {
      settings = await prisma.settings.create({
        data: updateData
      });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: updateData
      });
    }

    // Return nested structure for API compatibility
    const data = {
      _id: settings.id,
      theme: {
        primaryColor: settings.themePrimaryColor,
        secondaryColor: settings.themeSecondaryColor,
        accentColor: settings.themeAccentColor
      },
      seo: {
        title: settings.seoTitle,
        description: settings.seoDescription,
        keywords: settings.seoKeywords,
        ogImage: settings.seoOgImage
      },
      analytics: {
        googleAnalyticsId: settings.googleAnalyticsId
      },
      maintenanceMode: settings.maintenanceMode,
      customCSS: settings.customCSS,
      customJS: settings.customJS,
      footerText: settings.footerText,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
