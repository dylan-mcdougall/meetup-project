'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsToMany(
        models.Group,
        { through: 'Venue', foreignKey: 'id', otherKey: 'groupId', onDelete: 'CASCADE' }
      );
      Event.belongsTo(
        models.Venue,
        { as: 'eventVenue', foreignKey: 'venueId' }
      );
      Event.hasMany(
        models.Image,
        { as: 'EventImages', foreignKey: 'imageableId', constraints: false, onDelete: 'CASCADE', scope: { imageableType: 'Event' } } 
      );
      Event.hasMany(
        models.Attendance,
        { foreignKey: 'eventId', onDelete: 'CASCADE'}
      );
    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
