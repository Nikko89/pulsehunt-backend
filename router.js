const Router = require('koa-router');
const userController = require('./controllers/users.controller.js');
const trainerController = require('./controllers/trainers.controller.js');

const router = new Router();

// Routes
router.post('/user', userController.createUser);
router.get('/user/:userId', userController.getUser);
router.put('/user/:userId', userController.modifyUser);
router.delete('/user/:userId', userController.deleteUser);

router.post('/trainer', trainerController.createTrainer);
router.get('/trainer/:trainerId', trainerController.getTrainer);
router.put('/trainer/:trainerId', trainerController.modifyTrainer);
router.delete('/trainer/:trainerId', trainerController.deleteTrainer);

module.exports = router;
