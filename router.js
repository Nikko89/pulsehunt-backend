const Router = require('koa-router');
const trainerController = require('./controllers/trainers.controller.js');
const episodeController = require('./controllers/episodes.controller.js');
const { authMiddleware } = require('./auth.js');

const router = new Router();

// Routes

// MAIN PAGE AUTH CHECK
router.get('/', authMiddleware, ctx => (ctx.body = ctx.user));

// TRAINER

router.post('/trainer', trainerController.createTrainer); // new sign up implementation
router.get('/trainer/signin', trainerController.signIn); // new sign in implementation
router.get('/trainer/:trainerId', authMiddleware, trainerController.getTrainer);
router.put('/trainer/:trainerId', authMiddleware, trainerController.modifyTrainer);
router.delete('/trainer/:trainerId', authMiddleware, trainerController.deleteTrainer);
router.post('/upload', authMiddleware, trainerController.createUpload);

// EPISODE
router.post('/episode', authMiddleware, episodeController.createEpisode);
router.get('/episode/:episodeId', authMiddleware, episodeController.getEpisode);
router.get('/episodes', authMiddleware, episodeController.getEpisodes);
router.put('/episode/:episodeId', authMiddleware, episodeController.modifyEpisode);
router.delete('/episode/:episodeId', authMiddleware, episodeController.deleteEpisode);

module.exports = router;
