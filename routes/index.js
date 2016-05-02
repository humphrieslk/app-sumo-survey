
var models = require("../models");

exports.getAnswers = function(req, res) {
    models.answers.findAll({
    where: {
       question_id: req.body.id
    }
    }).then(function (answers) {
        res.json(answers);
    }).catch(function (err) {
        console.log(err);
    });
};

exports.getQuestions = function(req, res) {
    models.questions.findAndCountAll().then(function(questions){
        res.json(questions);
    });
};

// ***** remove these *****
exports.index = function(req, res){
  res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};