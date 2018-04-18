const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
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
  episodes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Episode',
  }],
  signedUp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
