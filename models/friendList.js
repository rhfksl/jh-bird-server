'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const FriendList = sequelize.define(
    'FriendList',
    {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      friend_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  // eslint-disable-next-line
  FriendList.associate = (models) => {
    FriendList.belongsTo(models.Users);
  };
  return FriendList;
};
