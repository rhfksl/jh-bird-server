'use strict';
module.exports = (sequelize, DataTypes) => {
  const FriendList = sequelize.define(
    'FriendList',
    {
      userId: DataTypes.INTEGER,
      friendId: DataTypes.INTEGER,
    },
    {}
  );
  FriendList.associate = function (models) {
    FriendList.belongsTo(models.Users, { foreignKey: 'playerId' });
    FriendList.belongsTo(models.Users, { foreignKey: 'friendId' });
  };
  return FriendList;
};
