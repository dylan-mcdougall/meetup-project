'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: "Bob's Super Sick Party",
        about: 'Just some bros being dudes out doing bro things and holy how do I make this long enough?',
        type: 'In person',
        private: true,
        city: 'Fresno',
        state: 'CA'
      },
      {
        organizerId: 2,
        name: "Karen's Hot Goss Sesh",
        about: 'Bring some piping hot tea so we can talk mad ish on everyone else and man fake data is c r i n g e',
        type: 'Online',
        private: true,
        city: 'New York City',
        state: 'NY'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      organizerId: { [Op.in]: [1, 2] }
    }, {});
  }
};
