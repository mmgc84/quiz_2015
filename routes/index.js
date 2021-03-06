var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var autologoutController = require('../controllers/autologout_controller');
var estadisticasController = require('../controllers/estadisticas_controller');

// Pagina de entrada (home page)
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId
router.param('commentId', commentController.load); //autoload :commentId

// Definicion de rutas de session
router.get('/login', sessionController.new); // formulario login
router.post('/login', sessionController.create); // crear sesión
router.delete('/logout', sessionController.destroy); //destruir sesión

// Definicion de rutas de  /quizes
router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
router.get('/quizes/new',                   autologoutController.check,
sessionController.loginRequired, quizController.new);
router.post('/quizes/create',               autologoutController.check,
sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',    autologoutController.check,
sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',         autologoutController.check,
sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',      autologoutController.check,
sessionController.loginRequired, quizController.destroy);

// Definicion de rutas de  comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',    commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',       commentController.create);
router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
autologoutController.check, sessionController.loginRequired,
commentController.publish);

// Definicion de rutas de estadisticas
router.get('/estadisticas',                       estadisticasController.show);

// Definicion de rutas de creditos
router.get('/author',                       quizController.author);


module.exports = router;
