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
        url: 'https://aaprojectbucket.s3.us-west-1.amazonaws.com/josephine-gasser-cv83wpGtFtg-unsplash.jpg',
        preview: true,
        imageableId: 1,
        imageableType: 'Event'
      },
      {
        url: 'https://aaprojectbucket.s3.us-west-1.amazonaws.com/joanna-kosinska-9WNi3OTzqtI-unsplash.jpg',
        preview: true,
        imageableId: 2,
        imageableType: 'Event'
      },
      {
        url: 'https://aaprojectbucket.s3.us-west-1.amazonaws.com/jed-villejo-pumko2FFxY0-unsplash.jpg',
        preview: true,
        imageableId: 1,
        imageableType: 'Group'
      },
      {
        url: 'https://aaprojectbucket.s3.us-west-1.amazonaws.com/melanie-stander-olOlNIG6DmI-unsplash.jpg',
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
