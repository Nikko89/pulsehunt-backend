const mongoose = require('mongoose');
const validator = require('validator');

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Please supply a name.',
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email address.'],
    required: 'Please supply an email address.',
  },
  bio: {
    type: String,
    trim: true,
  },
  photos: [String],
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
