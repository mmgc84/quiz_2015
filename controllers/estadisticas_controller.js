var models = require('../models/models.js');

exports.show = function(req, res) {

models.Quiz.findAll().then(
  function(quizes) {
    quizes: quizes;

    models.Comment.findAll().then(
      function(comments) {
        comments: comments;
        media = comments.length / quizes.length;
        var pComentadas = [];

        for(quiz in quizes) {
          for(comment in comments) {
            if(comments[comment].QuizId == quizes[quiz].id) {
              if(pComentadas.indexOf(comments[comment].QuizId) == -1)
               {
                 console.log ("Hay comentarios");
                 console.log ("C Texto > " + comments[comment].texto + " C QuizId " + comments[comment].QuizId);
                 pComentadas.push(comments[comment].QuizId);
               }
            }
          }
        }

        console.log("pComentadas > " + pComentadas);
        console.log("pComentadas length> " + pComentadas.length);

        console.log("Comentarios > " + comments.length);
        console.log("Preguntas > " + quizes.length);

        var sinComentarios =  quizes.length - pComentadas.length ;
        var conComentarios = pComentadas.length;

        res.render('estadisticas', { quizes: quizes, comments: comments,
          media: media, conComentarios: conComentarios,
          sinComentarios: sinComentarios, errors: []});
      }
    )
  }
)

};
