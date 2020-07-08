'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChattingRoom = sequelize.define(
    'ChattingRoom',
    {
      roomname: DataTypes.STRING,
      roomname2: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      userId2: DataTypes.INTEGER,
    },
    {}
  );
  ChattingRoom.associate = function (models) {
    ChattingRoom.belongsTo(models.Users, { foreignKey: 'userId' });
    ChattingRoom.hasMany(models.Chat, { onDelete: 'cascade' });
  };
  return ChattingRoom;
};
