'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      user_id: DataTypes.STRING,
      password: DataTypes.STRING,
      nickname: DataTypes.STRING,
    },
    {}
  );
  Users.associate = function (models) {
    Users.hasMany(models.ChattingRoom, { onDelete: 'cascade' });
    Users.hasMany(models.FriendList, { onDelete: 'cascade' });
    Users.hasMany(models.Chat, { onDelete: 'cascade' });
  };
  return Users;
};
