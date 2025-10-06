const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required']
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: ['Web Development', 'UI/UX Design', 'Mobile App']
  },
  image: {
    type: String,
    required: [true, 'Project image is required']
  },
  projectLink: {
    type: String,
    required: [true, 'Project link is required']
  },
  githubLink: {
    type: String,
    default: ''
  },
  technologies: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
