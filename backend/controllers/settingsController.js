const prisma = require('../config/prisma');

// Helper: format settings response to match MongoDB nested structure
const formatSettingsResponse = (settings) => {
  if (!settings) return null;
  return {
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
};

// Helper: extract nested objects from request body into flat columns
const extractSettingsData = (body) => {
  const { theme, seo, analytics, ...rest } = body;
  const data = { ...rest };
  
  if (theme) {
    if (theme.primaryColor !== undefined) data.themePrimaryColor = theme.primaryColor;
    if (theme.secondaryColor !== undefined) data.themeSecondaryColor = theme.secondaryColor;
    if (theme.accentColor !== undefined) data.themeAccentColor = theme.accentColor;
  }
  
  if (seo) {
    if (seo.title !== undefined) data.seoTitle = seo.title;
    if (seo.description !== undefined) data.seoDescription = seo.description;
    if (seo.keywords !== undefined) data.seoKeywords = seo.keywords;
    if (seo.ogImage !== undefined) data.seoOgImage = seo.ogImage;
  }
  
  if (analytics) {
    if (analytics.googleAnalyticsId !== undefined) data.googleAnalyticsId = analytics.googleAnalyticsId;
  }
  
  return data;
};

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }

    res.status(200).json({
      success: true,
      data: formatSettingsResponse(settings)
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
    const data = extractSettingsData(req.body);

    if (!settings) {
      settings = await prisma.settings.create({ data });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data
      });
    }

    res.status(200).json({
      success: true,
      data: formatSettingsResponse(settings)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
