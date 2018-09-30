const Router = require('koa-router');
const userController = require('./controllers/users.controller.js');
const trainerController = require('./controllers/trainers.controller.js');
const episodeController = require('./controllers/episodes.controller.js');
const { authorize, test } = require('./auth.js');

const router = new Router();

// Routes

// MAIN PAGE CHECK
router.get('/', authorize, test);

// USER
router.post('/user', userController.createUser);
router.get('/user/:userId', userController.getUser);
router.put('/user/:userId', userController.modifyUser);
router.delete('/user/:userId', userController.deleteUser);

// TRAINER

router.post('/trainer', trainerController.createTrainer); // new sign up implementation
router.get('/trainer/signin', trainerController.signIn); // new sign in implementation
router.get('/trainer/privateroute', authorize, trainerController.private); // testing
router.get('/trainer/:trainerId', trainerController.getTrainer);
router.put('/trainer/:trainerId', trainerController.modifyTrainer);
router.delete('/trainer/:trainerId', trainerController.deleteTrainer);
router.post('/upload', trainerController.createUpload);

// EPISODE
router.post('/episode', episodeController.createEpisode);
router.get('/episode/:episodeId', episodeController.getEpisode);
router.get('/episodes', episodeController.getEpisodes);
router.put('/episode/:episodeId', episodeController.modifyEpisode);
router.delete('/episode/:episodeId', episodeController.deleteEpisode);

module.exports = router;
