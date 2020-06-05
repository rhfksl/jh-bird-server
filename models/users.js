'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Users = sequelize.define('Users', {
//     userId: DataTypes.STRING,
//     password: DataTypes.STRING,
//     nickname: DataTypes.STRING
//   }, {});
//   Users.associate = function(models) {
//     // associations can be defined here
//   };
//   return Users;
// };

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
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
    }
    // {
    //   timestamps: false,
    //   hooks: {
    //     afterValidate: (user) => {
    //       // eslint-disable-next-line
    //       user.password = encrypt(user.password);
    //     },
    //   },
    // },
  );
  // eslint-disable-next-line
  Users.associate = (models) => {
    // Users.hasMany(models.ChattingRoom);
    // Users.hasOne(models.FriendList);
    // Users.hasOne(models.FriendList);
    Users.hasMany(models.ChattingRoom, { foreignKey: 'user_id' });
    Users.hasOne(models.FriendList, { foreignKey: 'user_id' });
    Users.hasOne(models.FriendList, { foreignKey: 'friend_id' });
    Users.hasMany(modesl.Chat, { foreignKey: 'user_id' });
  };
  return Users;
};
