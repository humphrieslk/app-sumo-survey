'use strict';

/* Services */

angular.module('surveyApp.services', []).
service('UnsavedData', function () {
  var unsavedData = this; 
  unsavedData.unsavedData = false; 
}).value('version', '0.1');