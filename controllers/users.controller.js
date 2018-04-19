const User = require('../models/User');

module.exports.createUser = async (ctx) => {
  try {
    const user = new User(ctx.request.body);
    ctx.body = await user.save();
    ctx.status = 201;
  } catch (err) {
    if (err.code === 11000) {
      ctx.body = 'Email must be unique.';
    } else {
      ctx.body = `Unable to save. ${err.message}`;
    }
    ctx.status = 400;
  }
};

module.exports.getUser = async (ctx) => {
  try {
    const user = await User.findOne({ _id: ctx.params.userId });
    if (!user) {
      ctx.body = 'No user with that id found.';
      ctx.status = 404;
    } else {
      ctx.body = user;
      ctx.status = 200;
    }
  } catch (err) {
    ctx.body = `An unexpected error occurred. ${err}`;
    ctx.status = 400;
  }
};

module.exports.modifyUser = async (ctx) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      ctx.params.userId,
      ctx.request.body,
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      ctx.body = 'No user with that id found.';
      ctx.status = 404;
    } else {
      ctx.body = updatedUser;
      ctx.status = 200;
    }
  } catch (err) {
    ctx.body = `Unable to update. ${err}`;
    ctx.status = 400;
  }
};

module.exports.deleteUser = async (ctx) => {
  try {
    const deletedUser = await User.findByIdAndRemove(ctx.params.userId);
    if (!deletedUser) {
      ctx.body = 'No user with that id found.';
      ctx.status = 404;
    } else {
      ctx.body = deletedUser;
      ctx.status = 200;
    }
  } catch (err) {
    ctx.body = `Delete failed. ${err}`;
    ctx.status = 400;
  }
};
