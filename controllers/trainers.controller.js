const Trainer = require('../models/Trainer');
const cloudinary = require('cloudinary');
const atob = require('atob');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const key = require('../config.js');

// new signup implementation
module.exports.createTrainer = async (ctx) => {
  const trainerData = ctx.request.body;
  let user = await Trainer.findOne({ email: trainerData.email });
  if (!user) {
    const hash = await bcrypt.hash(trainerData.password, 10);
    user = new Trainer({ ...trainerData, password: hash });
    await user.save();
    const token = jwt.sign({ expt: Math.floor(Date.now() / 1000 + 60 * 60 * 24), user }, key);
    ctx.body = {
      username: user.username,
      name: user.name,
      bio: user.bio,
      _id: user._id,
      type: user.type,
      token,
      episodes: user.episodes,
    };
    ctx.status = 201;
  } else {
    ctx.status = 401;
    ctx.body = { message: 'email already registered' };
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
  console.log(user);
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ expt: Math.floor(Date.now() / 1000 + 60 * 60 * 24), user }, key);
      delete user._doc.password;
      user._doc.token = token;
      ctx.body = user._doc;
    } else {
      ctx.status = 403;
      ctx.body = { message: 'wrong password/username combination' };
    }
  } else {
    ctx.status = 403;
    ctx.body = { message: 'username not found' };
  }
};

// testing private route

module.exports.private = async (ctx) => {
  console.log(ctx);
  ctx.status = 200;
  ctx.body = {
    message: 'congrats you reached a private route',
    userData: ctx.userData,
  };
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
    const updatedTrainer = await Trainer.findOneAndUpdate(
      { _id: ctx.user.user._id },
      { $addToSet: { episodes: ctx.request.body.episodes } },
      {
        new: true,
        runValidators: true,
      },
      res => res,
    );
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
