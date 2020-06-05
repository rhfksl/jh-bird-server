'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ChattingRoom = sequelize.define('ChattingRoom', {
    roomId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  // eslint-disable-next-line
  ChattingRoom.associate = (models) => {
    ChattingRoom.belongsTo(models.Users);
    ChattingRoom.hasMany(models.Chat, { foreignKey: 'chattingRoom_id' });
  };
  return ChattingRoom;
};
