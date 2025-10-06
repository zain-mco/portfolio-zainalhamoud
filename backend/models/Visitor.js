const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  // Additional tracking data
  browser: String,
  os: String,
  device: String,
  referrer: String,
  country: String,
  city: String
}, {
  timestamps: true
});

// Index for efficient querying
visitorSchema.index({ ipAddress: 1, timestamp: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);
