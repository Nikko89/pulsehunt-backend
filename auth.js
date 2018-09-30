const jwt = require('jsonwebtoken');

module.exports.authorize = (ctx, next) => {
  const headerCookie = ctx.cookies.get('pulsehunt_cookie');
  if (!headerCookie) {
    console.log('no cookie');
    ctx.status = 403;
    ctx.body = 'need to log in';
    return;
  }
  jwt.verify(headerCookie, 'ramen', (err, res) => {
    if (err) {
      console.log('error: ', err);
      console.log('cookie not valid');
      ctx.body = 'log in needed to access restricted area';
      ctx.status = 403;
    } else {
      console.log(res);
      ctx.body = res;
      next();
    }
  });
};

module.exports.test = (ctx) => {
  ctx.body = 'mission accomplished';
};
