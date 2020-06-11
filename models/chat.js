'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    'Chat',
    {
      userChat: DataTypes.STRING,
      chattingRoomId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {}
  );
  Chat.associate = function (models) {
    Chat.belongsTo(models.ChattingRoom, { foreignKey: 'chattingRoomId' });
    Chat.belongsTo(models.Users, { foreignKey: 'userId' });
  };
  return Chat;
};
