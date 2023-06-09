'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Images';
    return queryInterface.bulkInsert(options, [
      {
        url: 'demo Url',
        preview: true,
        imageableId: 1,
        imageableType: 'Event'
      },
      {
        url: 'it me, demo',
        preview: true,
        imageableId: 2,
        imageableType: 'Event'
      },
      {
        url: 'Beep Boop',
        preview: true,
        imageableId: 1,
        imageableType: 'Group'
      },
      {
        url: 'other url here',
        preview: true,
        imageableId: 2,
        imageableType: 'Group'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      imageableType: { [Op.in]: ['Event', 'Group'] }
    });
  }
};
