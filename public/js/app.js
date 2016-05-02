'use strict';

// Declare app level module which depends on filters, and services

angular.module('surveyApp', [
  'surveyApp.controllers',
  'surveyApp.filters',
  'surveyApp.services',
  'surveyApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/survey', {
      controller: 'SurveyCtrl'
  }).
//    when('/view2', {
//      templateUrl: 'partials/partial2',
//      controller: 'MyCtrl2'
//    }).
    otherwise({
      redirectTo: '/survey'
    });

  $locationProvider.html5Mode(true);
});
