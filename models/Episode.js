const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: 'Please supply a name.',
      trim: true,
    },
    trainer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trainer',
      required: 'You must supply a trainer.',
    },
    startTime: {
      type: Date,
      required: 'You must supply a start time.',
      min: Date.now,
    },
    endTime: {
      type: Date,
      required: 'You must supply an end time.',
    },
    description: {
      type: String,
      trim: true,
      required: 'You must supply a description.',
    },
    photo: String,
    attendees: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: [
        {
          type: Number,
          required: 'You must supply coordinates.',
        },
      ],
      address: {
        type: String,
        required: 'You must supply an address.',
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    sweatScore: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true, setDefaultsOnInsert: true },
);

episodeSchema.index({ location: '2dsphere' });

episodeSchema.pre('validate', function val(next) {
  if (this.startTime > this.endTime) {
    next(new Error('The episode cannot end before it has started.'));
  } else {
    next();
  }
});

episodeSchema.pre('save', function uniqueTags(next) {
  this.tags = Array.from(new Set(this.tags));
  next();
});

function autopopulate(next) {
  this.populate('trainer', 'name');
  next();
}

episodeSchema.pre('find', autopopulate);
episodeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Episode', episodeSchema);
