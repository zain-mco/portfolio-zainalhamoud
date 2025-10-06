const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  workExperience: [{
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    responsibilities: [{
      type: String
    }],
    order: {
      type: Number,
      default: 0
    }
  }],
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    link: {
      type: String
    },
    image: {
      type: String
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);
