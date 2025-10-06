const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Zain L. Alhamoud'
  },
  title: {
    type: String,
    required: true,
    default: 'UI/UX Designer & Web Developer'
  },
  bio: {
    type: String,
    required: true,
    default: 'A passionate 27-year-old designer and developer from Syria'
  },
  description: {
    type: String,
    default: 'specializing in creating beautiful, functional digital experiences that solve real-world problems and delight users.'
  },
  profileImage: {
    type: String,
    default: '/assets/zain.svg'
  },
  resumeFile: {
    type: String,
    default: ''
  },
  typewriterTexts: [{
    type: String
  }],
  heroStats: {
    projects: {
      type: String,
      default: '15+'
    },
    experience: {
      type: String,
      default: '3+'
    },
    satisfaction: {
      type: String,
      default: '100%'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Personal', personalSchema);
