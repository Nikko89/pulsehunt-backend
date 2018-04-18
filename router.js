const Router = require('koa-router');
const controller = require('./controllers/controller.js');

const router = new Router();

// Routes
router.get('/hello', controller.sayHi);

module.exports = router;
