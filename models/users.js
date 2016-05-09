'use strict';

module.exports = function (sequelize, DataTypes) {
  var Users = sequelize.define('users', {
    username: {
      type: DataTypes.STRING, 
        allowNull: false
    }, 
    hash: {
      type: DataTypes.STRING, 
      allowNull: false
    }
  });
    
    return Users;
};