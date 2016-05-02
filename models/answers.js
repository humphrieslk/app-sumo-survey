'use strict';

module.exports = function (sequelize, DataTypes) {
    var Answers = sequelize.define('answers', {
        question_id: {
            type: DataTypes.INTEGER, 
            allowNull: false
        }, 
        answer_body: {
            type: DataTypes.STRING, 
            allowNull: false
        }
    });
    return Answers;
};