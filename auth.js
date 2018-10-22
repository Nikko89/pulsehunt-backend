const mySecret = require('./config.js');

const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (ctx, next) => {
  const authHeaders = ctx.request.header.authorization;
  const credentials = authHeaders.split(' ');
  if (authHeaders && credentials[0] === 'Bearer') {
    const token = credentials[1];
    try {
      ctx.user = jwt.verify(token, mySecret.mySecret);
      await next();
    } catch (error) {
      ctx.body = { error: 'you shall not pass' };
      ctx.status = 400;
    }
  } else {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized',
    };
  }
};
