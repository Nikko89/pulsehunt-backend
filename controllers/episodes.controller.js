const Episode = require('../models/Episode');
// const moment = require('moment');

module.exports.createEpisode = async (ctx) => {
  try {
    const episode = new Episode(ctx.request.body);
    ctx.body = await episode.save();
    ctx.status = 201;
  } catch (err) {
    ctx.body = `Unable to save. ${err.message}`;
    ctx.status = 400;
  }
};

module.exports.getEpisode = async (ctx) => {
  try {
    const episode = await Episode.findOne({ _id: ctx.params.episodeId });
    if (!episode) {
      ctx.body = 'No episode with that id found.';
      ctx.status = 404;
    } else {
      ctx.body = episode;
      ctx.status = 200;
    }
  } catch (err) {
    ctx.body = `An unexpected error occurred. ${err}`;
    ctx.status = 400;
  }
};

module.exports.getEpisodes = async (ctx) => {
  try {
    const {
      lng,
      lat,
      dist = 5000,
    } = ctx.query;

    const coordinates = [lng, lat].map(parseFloat);
    const maxDistance = parseFloat(dist);

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates,
          },
          $maxDistance: maxDistance,
        },
      },
    };

    if (ctx.query.start) {
      query.startTime = { $gte: new Date(parseFloat(ctx.query.start)) };
    }
    if (ctx.query.end) {
      query.endTime = { $lte: new Date(parseFloat(ctx.query.end)) };
    }

    const episodes = await Episode.find(query);
    ctx.body = episodes;
  } catch (err) {
    ctx.body = `Unable to update. ${err}`;
    ctx.status = 400;
  }
};

module.exports.modifyEpisode = async (ctx) => {
  try {
    const updatedEpisode = await Episode.findByIdAndUpdate(
      ctx.params.episodeId,
      ctx.request.body,
      { new: true, runValidators: true },
    );
    if (!updatedEpisode) {
      ctx.body = 'No episode with that id found.';
      ctx.status = 404;
    } else {
      ctx.body = updatedEpisode;
      ctx.status = 200;
    }
  } catch (err) {
    ctx.body = `Unable to update. ${err}`;
    ctx.status = 400;
  }
};

module.exports.deleteEpisode = async (ctx) => {
  try {
    const deletedEpisode = await Episode.findByIdAndRemove(ctx.params.episodeId);
    if (!deletedEpisode) {
      ctx.body = 'No episode with that id found.';
      ctx.status = 404;
    } else {
      ctx.body = deletedEpisode;
      ctx.status = 200;
    }
  } catch (err) {
    ctx.body = `Delete failed. ${err}`;
    ctx.status = 400;
  }
};
