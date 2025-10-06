const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    default: 'zenlalhamoud@gmail.com'
  },
  phone: {
    type: String,
    required: true,
    default: '+971 (504) 235-113'
  },
  location: {
    type: String,
    default: 'Abu Dhabi, UAE'
  },
  whatsapp: {
    type: String,
    default: '971504235113'
  },
  socialLinks: [{
    platform: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { Contact, Message };
