'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn(
        'ChattingRooms', // name of Target model
        'userId2', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
      .then(() =>
        queryInterface.addColumn(
          'Users', // name of Target model
          'img', // name of the key we're adding
          {
            type: Sequelize.STRING,
          }
        )
      )
      .then(() =>
        queryInterface.addColumn(
          'ChattingRooms', // name of Target model
          'roomname2', // name of the key we're adding
          {
            type: Sequelize.STRING,
          }
        )
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn(
        'ChattingRooms', // name of the Target model
        'userId2' // key we want to remove
      )
      .then(() =>
        queryInterface.removeColumn(
          'Users', // name of the Target model
          'img' // key we want to remove
        )
      )
      .then(() =>
        queryInterface.removeColumn(
          'ChattingRooms', // name of the Target model
          'roomname2' // key we want to remove
        )
      );
  },
};
