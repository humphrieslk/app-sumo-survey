var models = require("../models");
var _ = require('underscore');

exports.getAnswers = function (req, res) {
  models.answers.findAll({
    where: {
      question_id: req.body.question_id
    }
  }).then(function (answers) {
    res.json(answers);
  }).catch(function (err) {
    console.log(err);
  });
};

exports.getSurveyQuestion = function (req, res) {
  models.questions.findAndCountAll().then(function (findAllResponse) {    
    var questions = findAllResponse.rows;
    var questionIds = _.pluck(findAllResponse.rows, 'id');
    var result = {};
        
    models.responses.findAll({
      where: {
        session_id: req.sessionID
      }
    }).then(function (responses) {
            
      // array of just the question Ids of previously answered
      var previousResponses = _.pluck(responses, 'question_id');
            
      // remove any ids from previous responses from questionIds 
      previousResponses.forEach(function (questionId) {
        questionIds = _.without(questionIds, questionId);
      });
            
      // if there are any questions the user hasn't answered
      if (questionIds.length > 0) {
                
        // get a random question ID to show 
        var randomIndex = Math.floor(Math.random() * questionIds.length);
        var id = questionIds[randomIndex];
                
        result.question = _.findWhere(questions, {
          id: id
        });
          
        models.answers.findAll({
          where: {
            question_id: id
          }
        }).then(function (answers) {
          result.answers = answers;
          res.json(result);
        }).catch(function (err) {
          console.log(err);                    
        });
      } else {   
                
        // no questions left 
        res.send(204);
      }
    });
  });
};

exports.index = function (req, res){
  res.render('index');
};

exports.login = function (req, res) {
  res.render('login');
};

exports.recordResponse = function (req, res) {
  models.responses.create({
    session_id: req.sessionID, 
    question_id: req.body.question_id, 
    answer_id: req.body.answer_id
  });
    
  res.send(200);
};