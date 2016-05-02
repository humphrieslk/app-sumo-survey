'use strict';

/* Controllers */

angular.module('surveyApp.controllers', []).
controller('SurveyCtrl', function ($scope, $http) {

    // get the answers for the given question ID 
    var getAnswers = function (questionId) {
        $http.post('/answers', {
            id: questionId
        }).success(function (data, status, headers, config) {
            $scope.answers = data;
            if (data == "") {
                $scope.answers = [];
            }
            console.log('success');
        }).error(function (data, status, headers, config) {
            console.log('Ops: could not get any data');
        });
    }

    // make a request for how many questions there are and their rows
    $http.get('/questions').success(function (data, status, headers, config) {
        if (data == "") {
            $scope.showQuestions = false;
            $scope.questions = [];
            $scope.question = "Question? What Question?"
        } else {
            $scope.questions = data.rows;
            $scope.questionCount = data.count;

            if ($scope.questionCount > 0) {
                // get a random question ID to show 
                // as of now, there is no way to prevent the same question from being shown
                // to the user
                var randomQuestionId = Math.floor(Math.random() * $scope.questionCount);
                var question = $scope.questions[randomQuestionId];
                var questionId = question.id;

                $scope.showQuestions = true;
                $scope.questionBody = question.question_body;

                // make the request for the answers now that we know the 
                // question ID
                getAnswers(questionId);
            }
        }
        console.log('success');
    }).error(function (data, status, headers, config) {
        console.log('Ops: could not get any data');
    });

    // not implemented yet
    // allows the user to skip the question and get a new one 
    // the user will *eventually* not see this question anymore
    $scope.skipQuestion = function () {

    }


    // not implemented yet 
    // will submit their survey and record answers into the database
    $scope.submitSurvey = function () {
        console.log('submitted');
        console.log($scope.selectedAnswer);

    }
});