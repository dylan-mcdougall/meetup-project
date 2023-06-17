'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        venueId: 1,
        name: 'Tennis Group First Meet and Greet',
        description: "First meet and greet event for the evening tennis on the water group!",
        type: 'Online',
        capacity: 10,
        price: 18.50,
        startDate: "2023-11-19 20:00:00",
        endDate: "2023-11-20 22:00:00"
      },
      {
        groupId: 2,
        venueId: null,
        name: 'Tea Time Innit',
        description: "Our famous weekly gossip session",
        type: 'In person',
        capacity: 3,
        price: 10.00,
        startDate: '2023-12-12 20:00:00',
        endDate: '2023-12-13 21:00:00'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2] }
    }, {});
  }
};
