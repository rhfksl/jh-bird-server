'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'ChattingRooms', // name of Target model
      'roomname2', // name of the key we're adding
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'ChattingRooms', // name of the Target model
      'roomname2' // key we want to remove
    );
  },
};
