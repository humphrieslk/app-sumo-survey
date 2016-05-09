'use strict';

module.exports = function (sequelize, DataTypes) {
  var Questions = sequelize.define('questions', {
    survey_id: {
      type: DataTypes.INTEGER, 
        allowNull: false
    }, 
    question_body: {
      type: DataTypes.STRING, 
        allowNull: false
    }
  });
    
    return Questions;
};