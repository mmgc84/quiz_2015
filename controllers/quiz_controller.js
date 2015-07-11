var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findOne({
    where: {id: Number(quizId) },
    include: [{ model: models.Comment }]
  }).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  if (req.query.search === undefined) { req.query.search = ''; }
  var patron = (req.query.search).replace(' ', '%');
  patron = '%' + patron + '%';
  models.Quiz.findAll({ where: ["pregunta like ?", patron], order: "pregunta"}).then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes, busqueda: req.query.search, errors: []});
    }
  ).catch(function(error) { next(error); })
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render(
    'quizes/answer',
    { quiz: req.quiz,
      respuesta: resultado,
      errors: []
    }
  );
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build ( //crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta", indice: ""}
  );

  res.render('quizes/new', { quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz.validate().then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz.save({fields: ["pregunta", "respuesta", "indice"]}).then(
          function() {res.redirect('/quizes')}
        )
      }
    }
  );
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz; //autoload de instancia de quiz
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.indice = req.body.quiz.indice;

  req.quiz
  .validate()
  .then(
    function (err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "indice"]})
        .then( function () { res.redirect('/quizes'); });
      } //Redireccion HTTP a lista de preguntas (URL relativo)
    }
  );
};

//DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

// GET /author
exports.author = function(req, res) {
    res.render('author', {author: 'Marcelo Martin Gutiérrez Cabezas', errors: []});
};
