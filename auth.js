const jwt = require('jsonwebtoken');

module.exports.authorize = async (ctx, next) => {
  const headerCookie = ctx.cookies.get('pulsehunt_cookie');
  const decoded = jwt.verify(headerCookie, 'ramen', (err, res) => {
    if (err) {
      console.log('error: ', err);
      ctx.body = 'log in needed to access restricted area';
      ctx.status = 403;
    } else {
      console.log(res);
      next();
    }
  });
};
