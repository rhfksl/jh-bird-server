'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  // eslint-disable-next-line
  Users.associate = (models) => {
    Users.hasMany(models.ChattingRoom, { foreignKey: 'user_id' });
    Users.hasOne(models.FriendList, { foreignKey: 'user_id' });
    Users.hasOne(models.FriendList, { foreignKey: 'friend_id' });
    Users.hasMany(models.Chat, { foreignKey: 'user_id' });
  };
  return Users;
};
