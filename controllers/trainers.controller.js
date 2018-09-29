const Trainer = require('../models/Trainer');
const cloudinary = require('cloudinary');
const atob = require('atob');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const key = 'ramen';

// new signup implementation
module.exports.createTrainer = async (ctx) => {
  const trainerData = ctx.request.body;
  let user = await Trainer.findOne({ email: trainerData.email });
  if (!user) {
    bcrypt.hash(trainerData.password, 10, async (err, hash) => {
      user = new Trainer({ ...trainerData, password: hash });
      if (err) console.log('error: ', err);
      ctx.response.body = await user.save();
    });
    ctx.status = 201;
  } else {
    ctx.status = 401;
    ctx.body = 'email already registered';
  }
};

// new signin implementation
module.exports.signIn = async (ctx) => {
  const basic = ctx.request.headers.authorization.split(' ');
  if (basic.length < 2 && basic[0] !== 'Basic') {
    throw new Error('Missing basic authentication header');
  }
  const decoded = atob(basic[1]);
  const username = decoded.split(':')[0];
  const password = decoded.split(':')[1];
  const user = await Trainer.findOne({ username });
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const token = jwt.sign(
      { expt: Math.floor(Date.now() / 1000 + 60 * 60 * 24), userId: user._id, iss: 'boss' },
      key,
    );
    ctx.cookies.set('pulsehunt_cookie', token);
    ctx.body = 'find it now';
  }
};

// testing private route

module.exports.private = async (ctx) => {
  ctx.status = 200;
  ctx.body = 'congrats you reached a private route';
};

module.exports.getTrainer = async (ctx) => {
  try {
    const trainer = await Trainer.findOne({ _id: ctx.params.trainerId });
    console.log(trainer);
    if (!trainer) {
      ctx.body = 'No trainer with that id found.';
      ctx.status = 404;
    } else {
      ctx.body = trainer;
      ctx.status = 200;
    }
  } catch (err) {
    ctx.body = `An unexpected error occurred. ${err}`;
    ctx.status = 400;
  }
};

module.exports.modifyTrainer = async (ctx) => {
  try {
    const updatedTrainer = await Trainer.findByIdAndUpdate(ctx.params.trainerId, ctx.request.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTrainer) {
      ctx.body = 'No trainer with that id found.';
      ctx.status = 404;
    } else {
      ctx.body = updatedTrainer;
      ctx.status = 200;
    }
  } catch (err) {
    ctx.body = `Unable to update. ${err}`;
    ctx.status = 400;
  }
};

module.exports.deleteTrainer = async (ctx) => {
  try {
    const deletedTrainer = await Trainer.findByIdAndRemove(ctx.params.trainerId);
    if (!deletedTrainer) {
      ctx.body = 'No user with that id found.';
      ctx.status = 404;
    } else {
      ctx.body = deletedTrainer;
      ctx.status = 200;
    }
  } catch (err) {
    ctx.body = `Delete failed. ${err}`;
    ctx.status = 400;
  }
};

module.exports.createUpload = async (ctx) => {
  try {
    const trainerId = ctx.request.body.fields.trainer;
    const res = await cloudinary.v2.uploader.upload(ctx.request.body.files.photo.path);
    const newTrainer = await Trainer.findByIdAndUpdate(
      trainerId,
      { $push: { photos: res.public_id } },
      { new: true },
    ).select('photos');
    ctx.body = { photos: newTrainer.photos };
    ctx.status = 200;
  } catch (err) {
    ctx.body = err.message;
    ctx.status = 400;
  }
};
