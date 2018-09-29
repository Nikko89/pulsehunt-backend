const mongoose = require('mongoose');
const validator = require('validator');

// TEMPORAY TRAINER MODEL FOR TESTING

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: 'Please supply a name.',
      trim: true,
    },
    username: {
      type: String,
      required: 'Please supply a username',
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
    password: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('Trainer', trainerSchema);
