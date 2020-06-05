'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userChat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chattingRoom_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  // eslint-disable-next-line
  Chat.associate = (models) => {
    Chat.belongsTo(models.ChattingRoom);
    Chat.belongsTo(models.Users);
  };
  return Chat;
};
