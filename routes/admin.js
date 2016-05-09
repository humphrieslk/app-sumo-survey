var models = require("../models");
var _ = require('underscore');

exports.manageSurveys = function (req, res) {
  res.render('admin/manageSurveys');
};

exports.viewResponses = function (req, res) {
  res.render('admin/viewResponses');
};

exports.getQuestions = function (req, res) {
  models.questions.findAll().then(function (questions) {
    res.json(questions);
  });   
};

exports.getResponseCounts = function (req, res) {
  // find and count all responses that are associated with that answer's id 
  models.responses.findAndCountAll({
    where: {
      answer_id: req.body.answer_id
    }
  }).then(function (answer) {
    res.json(answer);
  });
};

exports.addQuestion = function (req, res) { 
  models.questions.create({
    question_body: req.body.question_body, 
    survey_id: 1
  }).then(function (question) {
        
  // use the question id to add the answers
  var answers = req.body.answers;
    answers.forEach(function(a) {
      a.question_id = question.id;
    });
        
    models.answers.bulkCreate(answers);
    res.send(200);
  });  
};

exports.deleteQuestions = function (req, res) {  
  var questionIds = req.body.questionIds;
    
  questionIds.forEach(function (id) {
        
    // delete the question 
    models.questions.destroy({
      where: {
        id: id
      }
    });
        
    // delete the answers associated with the question 
    models.answers.destroy({
      where: {
        question_id: id
      }
    });
        
    // delete the responses associated with the question
    models.responses.destroy({
      where: {
        question_id: id
      }
    });
  });
    
  res.send(200);
};

exports.updateSurvey = function (req, res) {
    
  // entire question object was passed in with new updated question_body
  var question = req.body.question;
  var answers = question.answers;
  var answerIds = _.pluck(answers, 'id');
    
  if(question.question_body) {
        
    // if the question already exists 
    if(question.id != null) {
      models.questions.find({
        where: {
          id: question.id
        }
      }).then(function (ques) {

        // update question
        ques.update({
          question_body: question.question_body
        }); 
      });
            
      models.answers.findAll({
        where: {
          question_id: question.id
        }
      }).then( function (answerList) {
        answerList.forEach( function (ans){
          var updatedAnswer = _.findWhere(answers, {id: ans.id});
          if (updatedAnswer) {
            // if the answer id is in the updated answer ids, update
            if(updatedAnswer.answer_body != "" && _.contains(answerIds, ans.id)) {            
              ans.update({
                answer_body: updatedAnswer.answer_body
              });
                        
              answers = _.without(answers, _.findWhere(answers, {id: ans.id}));
             }  
           } else {
             ans.destroy(); 
           }
         });
            
        // go through leftover answers with no id and add 
        answers.forEach( function (ans) {
          if(ans.answer_body && ans.answer_body != "") {
            models.answers.create({
              question_id: question.id, 
              answer_body: ans.answer_body
            });
          }    
        });
      });
    } else {
      models.questions.create({
      question_body: question.question_body, 
        survey_id: 1
      }).then(function (q) {
        answers.forEach(function (answer) {
          answer.question_id = q.id;
        });
        models.answers.bulkCreate(answers);
      });
    }
      
    res.send(200);
  } else {
        res.send(400);
  }
};

exports.updateAnswer = function (req, res) {

  // entire answer object was passed in with new updated answer_body
  var answer = req.body;
    
  models.answers.find({
    where: {
      id: answer.id
    }
  }).then(function (answer) {
        
    // update answer
    answer.update({
      answer_body: answer.answer_body
    });

  });
    
  res.send(200);
};



