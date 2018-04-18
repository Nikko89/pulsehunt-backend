const Router = require('koa-router');
const userController = require('./controllers/users.controller.js');

const router = new Router();

// Routes
router.get('/user/:userId', userController.getUser);
router.post('/user', userController.createUser);
router.put('/user/:userId', userController.modifyUser);
router.delete('/user/:userId', userController.deleteUser);

module.exports = router;
