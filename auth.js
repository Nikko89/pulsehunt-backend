const jwt = require('jsonwebtoken');

module.exports.authorize = async (ctx, next) => {
  const headerCookie = ctx.cookies.get('pulsehunt_cookie');
  if (!headerCookie) {
    ctx.status = 403;
    ctx.body = 'need to log in';
    return;
  }
  jwt.verify(headerCookie, 'ramen', (err, res) => {
    if (err) {
      console.log('error: ', err);
      ctx.body = 'log in needed to access restricted area';
      ctx.status = 403;
    } else {
      console.log(res);
      ctx.body = res;
      next();
    }
  });
};
