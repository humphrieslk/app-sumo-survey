'use strict';

// Declare app level module which depends on filters, and services

angular.module('surveyApp', [
  'surveyApp.controllers',
  'surveyApp.filters',
  'surveyApp.services',
  'surveyApp.directives',
  'ngRoute'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
  when('/survey', {
    controller: 'SurveyCtrl'
  }).
  when('/nigol', {
    controller: 'LoginCtrl'
  }).
  when('/admin/manageSurveys', {
    controller: 'ManageSurveysCtrl'
  }).
  when('/admin/viewResponses', {
    controller: 'ViewResponsesCtrl'
  }).
  otherwise({
    redirectTo: '/survey'
  });

  $locationProvider.html5Mode(true);
});
