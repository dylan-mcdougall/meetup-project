'use strict';

const { User, Membership, Group } = require('../models/');

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}

const payload = [
  {
    username: 'Demo-lition',
    groupName: "Demo's buddies",
    about: 'Friends who like to do shtuff',
    type: 'Vibes',
    private: true,
    city: 'El Dorado',
    state: 'MX'
  },
  {
    username: 'FakeUser1',
    groupName: 'Faker Fans',
    about: 'T1 WIN T1 WIN T1 WIN',
    type: 'Nerds',
    private: false,
    city: 'New York',
    state: 'NY'
  },
  {
    username: 'FakeUser2',
    groupName: 'Tea Time',
    about: 'Bring some hot goss',
    type: 'Social',
    private: true,
    city: 'Irvine',
    state: 'CA'
  }
]
options.tableName = 'Groups';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all(payload.map(async (item) => {
      let { groupName, about, type, private, city, state } = item;
      let user = await User.findOne({ where: { username: item.username } });
      const group = await Group.create({
        organizerId: user.id,
        name: groupName,
        about,
        type,
        private,
        city,
        state
      });
      await Membership.create({
        userId: user.id,
        groupId: group.id,
        status: 'Member'
      });
    }));
  },

  async down (queryInterface, Sequelize) {
    for (let i = 0; i < payload.length; i++) {
      let user = await User.findOne({ where: { username: payload[i].username } });
      Group.destroy({ where: { organizerId: user.id } });
    }
  }
};
