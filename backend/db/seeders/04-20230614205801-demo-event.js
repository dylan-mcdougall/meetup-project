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
        description: "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
        type: 'Online',
        capacity: 10,
        price: 18.50,
        startDate: "2021-11-19 20:00:00",
        endDate: "2021-11-19 22:00:00"
      },
      {
        groupId: 2,
        venueId: 2,
        name: 'Tea Time Innit',
        description: "Our famous weekly gossip session",
        type: 'In Person',
        capacity: 3,
        price: 10.00,
        startDate: '2022-12-12 20:00:00',
        endDate: '2022-12-12 21:00:00'
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
