'use strict';

var isEmptyObject = function isEmptyObject(object) {
  return Object.keys(object).length === 0 && JSON.stringify(object) === JSON.stringify({});
};

/* Controllers */

angular.module('surveyApp.controllers', ['surveyApp.services']).
controller('NavCtrl', function ($scope, $http, $location, $window, UnsavedData) {
  $scope.location = $location.path();
    
  $scope.pages = [{
    title: 'Manage Surveys',
    url: '/admin/manageSurveys'
  }, {
    title: 'View Responses', 
    url: '/admin/viewResponses'
  }, {
    title: 'Survey', 
    url: '/survey'
  }];
    
  $scope.navClass = function navClass(page) {
    var currentRoute = $location.path() || '/admin/manageSurveys';
    if(currentRoute == page.url) {
      $scope.pageTitle = page.title;
      $scope.location = page.url;
    } 
        
    return page.url === currentRoute;
  };  
    
  $scope.navigate = function navigate(path) {
    if(UnsavedData.unsavedData) {
      if(confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
        $window.location.reload();
        $location.path(path);
        $scope.location = path;
        UnsavedData.unsavedData = false;
      } 
    } else {
      $location.path(path);
      $scope.location = path;
      $window.location.reload();
    }
  };
    
  $scope.logout = function logout() {
    $http.get('/logout').success(function (data, status, headers, config) {
      
      // redirect to survey page
      $location.path('/survey');
      $window.location.reload(); 
    }).error(function (data, status, headers, config) {
      console.log('Had trouble logging out');
    });   
  };
    
  // refresh if they click the back button
  $scope.$watch(function () {
    return $location.path();
  }, function (location) {
    if($scope.location != location) {
      $window.location.reload();
    }
  });
}).
controller('SurveyCtrl', function ($scope, $http, $location, $window) {
  $location.path('/survey');
  $scope.location = '/survey';

  // get the survey question!
  $http.get('/surveyQuestion').success(function (data, status, headers, config) {
    if(status == 204) {
      $scope.noQuestionText = 'You\'ve answered all the questions. Thanks!';
      $scope.question = false;
    } else {
      $scope.question = data.question;
      $scope.answers = data.answers;
    }
  }).error(function (data, status, headers, config) {
    console.log('Oops: could not get any data');
  });
    
  // will submit response and record answers into the database
  $scope.submitSurvey = function submitSurvey() {
    $http.post('/recordResponse', {
      question_id: $scope.question.id, 
      answer_id: $scope.selectedAnswer.id
    }).success(function (data, status, headers, config) {
            
    // redirect - will either be to admin interface or to login page 
      $location.path('/survey');
      $window.location.reload();    
    }).error(function (data, status, headers, config) {
      console.log('Could not verify login');
    });
  };
    
  // refresh if they click the back button
  $scope.$watch(function () {
    return $location.path();
  }, function (location) {
    if($scope.location != location) {
      $window.location.reload();
    }
  });
}).
controller('LoginCtrl', function ($scope, $http, $location, $window) {
  $location.path('/nigol');
  $scope.location = '/nigol';
    
  $scope.submit = function submit() {
    $http.post('/nigolAuthenticate', {
      username: $scope.username, 
      password: $scope.password
    }).success(function (data, status, headers, config) {
            
      // redirect - will either be to admin interface or to login page 
      $location.path('/admin/manageSurveys');
      $window.location.reload();
            
    }).error(function (data, status, headers, config) {
      console.log('Could not verify login');
    });
  };
    
  // refresh if they click the back button
  $scope.$watch(function () {
    return $location.path();
  }, function (location) {
    if($scope.location != location) {
      $window.location.reload();
    }
  }); 
}).
controller('ManageSurveysCtrl', function ($scope, $http, $location, $window, UnsavedData) {
  var expanded;
  var getAnswers = function getAnswers(question) {
    $http.post('/answers', {
      question_id: question.id
    }).success(function (data, status, headers, config) {
      question.answers = data;
      if (data == "") {
        question.answers = [];
      }
    }).error(function (data, status, headers, config) { 
      console.log('Ops: could not get any data');
    });
  };
    
  UnsavedData.unsavedData = false;
  $location.path('/admin/manageSurveys');
  $scope.toggleText = 'Expand';
    
  $http.get('/admin/getQuestions').success(function (data, status, headers, config) {
    $scope.questions = data;
    if(isEmptyObject(data)) {
      $scope.questions = false;
      $scope.noQuestionText = 'There are no questions in the survey to display'
    }  
  }).error(function (data, status, headers, config) {
    console.log('Oops: could not get any data');
  });
    
  $scope.toggleAll = function toggleAll() {
    expanded = !expanded; 
    if(expanded) {
      $scope.toggleText = 'Collapse';
      $scope.questions.forEach(function (question) {
        question.expanded = true;
        getAnswers(question);
      });
    } else {
      $scope.toggleText = 'Expand';
      $scope.questions.forEach(function (question) {
        question.expanded = false;
        getAnswers(question);
      });
    }
  };
    
  $scope.toggleRow = function toggleRow(question) {
    if(!question.edit) {
      question.expanded = !question.expanded;
      if(!question.answers) {
        getAnswers(question);
      }
    }
  };
    
  $scope.toggleEdit = function toggleEdit(question) {
    question.edit = !question.edit;
    question.edited = true;
    UnsavedData.unsavedData = true;
        
    if(question.edit) {
      if(!question.answers) {
        getAnswers(question);
      }
      question.expanded = false;
    } else {
      question.expanded = true;
    }
  };
    
  $scope.save = function save() {
    $scope.questions.forEach(function(question) {
      if(question.edited) {
        $http.post('/admin/updateSurvey', {
          question: question
        }).success(function (data, status, headers, config) {
          UnsavedData.unsavedData = false;
          $location.path('/admin/manageSurveys');
          $window.location.reload();
        }).error(function (data, status, headers, config) {
          if(status == 400) {
            alert('There was a problem saving one or more of your questions. ' +
                  'Please check to ensure you have entered a question and ' + 
                  'at least one answer.');
          }
          console.log('Could not add question');
        });
      }
    });
  }

  $scope.deleteQuestions = function deleteQuestions() {
    if(confirm('Are you sure you want to delete?')) {
        
      // get an array of the question IDs to delete
      var questionIds = [];
      $scope.questions.forEach(function (q) {
        
        // delete if user checked delete and the question has an id (is in the database)
        if(q.checked && q.id) {
          questionIds.push(q.id);
        } 
      });
            
      if(questionIds.length > 0) {
        $http.post('/admin/deleteQuestions', {
          questionIds: questionIds
        }).success(function (data, status, headers, config) {
          $window.location.reload();
        }).error(function (data, status, headers, config) {
          console.log('Could not add question');
        });
      } else {
        $window.location.reload();
      }
    }
  };
    
  $scope.addAnswer = function addAnswer(answers) {
    answers.push({});
  };
    
  $scope.deleteAnswer = function deleteAnswer(index, answers) {
    answers.splice(index, 1); 
  };
    
  $scope.addQuestion = function addQuestion() {
    if(!$scope.questions) {
      $scope.questions = [];
    }
    UnsavedData.unsavedData = true;
    $scope.questions.push({
      question_body: '', 
      edit: true,
      edited: true, // marks it to be saved later
      answers: [{
        answer_body: ''
      }]
    });
  };
}).
controller('ViewResponsesCtrl', function ($scope, $http, $location) {
  var expanded;
  var getResponseCounts = function (question) {
    question.answers.forEach(function (answer) {
      $http.post('/admin/getResponseCounts', {
        answer_id: answer.id
      }).success(function (data, status, headers, config) {
        answer.count = data.count;
      }).error(function (data, status, headers, config) {
        console.log('Ops: could not get any data');
      });
    });
  };
  $scope.toggleText = 'Expand';
    
  $http.get('/admin/getQuestions').success(function (data, status, headers, config) {
    $scope.questions = data;
    if(isEmptyObject(data)) {
      $scope.questions = false;
      $scope.noQuestionText = 'There are no questions in the survey to display'
    }  
  }).error(function (data, status, headers, config) {
    console.log('Oops: could not get any data');
  });
    
  $scope.getAnswers = function getAnswers(question) {
    $http.post('/answers', {
      question_id: question.id
    }).success(function (data, status, headers, config) {
      question.answers = data;
      getResponseCounts(question);
    }).error(function (data, status, headers, config) {
      console.log('Ops: could not get any data');
    });
  };
    
  $scope.toggleAll = function toggleAll() {
    expanded = !expanded; 
    if(expanded) {
      $scope.toggleText = 'Collapse';
      $scope.questions.forEach(function (question) {
        question.expanded = true;
        $scope.getAnswers(question);
      });
    } else {
      $scope.toggleText = 'Expand';
      $scope.questions.forEach(function (question) {
        question.expanded = false;
        $scope.getAnswers(question);
      });
    }
  };
});