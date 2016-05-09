'use strict';

module.exports = function (sequelize, DataTypes) {
  var Responses = sequelize.define('responses', {
    session_id: DataTypes.STRING, 
    question_id: DataTypes.INTEGER, 
    answer_id: DataTypes.INTEGER
  });
    
  return Responses;
};