const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  theme: {
    primaryColor: {
      type: String,
      default: '#0066FF'
    },
    secondaryColor: {
      type: String,
      default: '#8B5CF6'
    },
    accentColor: {
      type: String,
      default: '#06D6A0'
    }
  },
  seo: {
    title: {
      type: String,
      default: 'Zain L. Alhamoud - UI/UX Designer & Web Developer'
    },
    description: {
      type: String,
      default: 'Professional portfolio showcasing modern web development and design projects'
    },
    keywords: {
      type: String,
      default: 'UI/UX Designer, Web Developer, React, JavaScript, Portfolio'
    },
    ogImage: {
      type: String,
      default: ''
    }
  },
  analytics: {
    googleAnalyticsId: {
      type: String,
      default: ''
    }
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  customCSS: {
    type: String,
    default: ''
  },
  customJS: {
    type: String,
    default: ''
  },
  footerText: {
    type: String,
    default: '© 2025 Zain L. Alhamoud. All rights reserved.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
