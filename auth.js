const jwt = require('jsonwebtoken');

module.exports.authMiddleware = (ctx, next) => {
  const authHeaders = ctx.request.header.authorization;
  const credentials = authHeaders.split(' ');
  if (authHeaders && credentials[0] === 'Bearer') {
    const token = credentials[1];
    // jwt.verify(token, 'ramen', (err, res) => {
    //   if (err) {
    //     console.log('error: ', err);
    //     console.log('token not valid');
    //     ctx.body = {
    //       error: 'log in needed to access restricted area',
    //     };
    //     ctx.status = 401;
    //   } else {
    //     ctx.user = res;
    //     next();
    //   }
    // });
    try {
      ctx.user = jwt.verify(token, 'ramen');
      return next();
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
