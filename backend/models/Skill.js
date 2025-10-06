const mongoose = require('mongoose');

const skillCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    default: 'fas fa-code'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const additionalTechSchema = new mongoose.Schema({
  technologies: [{
    type: String
  }]
}, {
  timestamps: true
});

const SkillCategory = mongoose.model('SkillCategory', skillCategorySchema);
const Skill = mongoose.model('Skill', skillSchema);
const AdditionalTech = mongoose.model('AdditionalTech', additionalTechSchema);

module.exports = { SkillCategory, Skill, AdditionalTech };
