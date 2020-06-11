'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChattingRoom = sequelize.define(
    'ChattingRoom',
    {
      roomname: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {}
  );
  ChattingRoom.associate = function (models) {
    ChattingRoom.belongsTo(models.Users, { foreignKey: 'userId' });
    ChattingRoom.hasMany(models.Chat, { onDelete: 'cascade' });
  };
  return ChattingRoom;
};
