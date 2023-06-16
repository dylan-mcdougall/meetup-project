'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(
        models.User,
        { as: 'Organizer', foreignKey: 'organizerId', otherKey: 'id' }
      );
      Group.belongsToMany(
        models.User,
        { through: 'Membership', foreignKey: 'groupId', otherKey: 'id' }
      );
      Group.belongsToMany(
        models.Event,
        { through: models.Venue, foreignKey: 'groupId' }
      );
      Group.hasMany(
        models.Image,
        { as: 'GroupImages', foreignKey: 'imageableId', onDelete: 'CASCADE', constraints: false, scope: { imageableType: 'Group' } }
      );
      Group.hasMany(
        models.Venue,
        { foreignKey: 'groupId', onDelete: 'CASCADE' }
      )
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group'
  });
  return Group;
};
