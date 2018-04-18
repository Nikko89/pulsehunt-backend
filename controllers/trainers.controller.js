const Trainer = require('../models/Trainer');

module.exports.createTrainer = async (ctx) => {
  try {
    const trainer = new Trainer(ctx.request.body);
    ctx.body = await trainer.save();
    ctx.status = 201;
  } catch (err) {
    ctx.body = `Unable to save. ${err}`;
    ctx.status = 400;
  }
};

module.exports.getTrainer = async (ctx) => {
  try {
    const trainer = await Trainer.findOne({ _id: ctx.params.trainerId });
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
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      ctx.params.trainerId,
      ctx.request.body,
      { new: true, runValidators: true },
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
