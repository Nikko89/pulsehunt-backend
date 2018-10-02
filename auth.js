const jwt = require('jsonwebtoken');

module.exports.authorize = (ctx, next) => {
  const authHeaders = ctx.request.header.authorization;
  if (authHeaders && authHeaders.split(' ')[0] === 'Bearer') {
    const token = authHeaders.split(' ')[1];
    jwt.verify(token, 'ramen', (err, res) => {
      if (err) {
        console.log('error: ', err);
        console.log('token not valid');
        ctx.body = 'log in needed to access restricted area';
        ctx.status = 401;
      } else {
        ctx.userData = res;
        ctx.body = res;
        next();
      }
    });
  } else {
    ctx.status = 401;
  }
};
