'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
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
        { through: 'Venue', foreignKey: 'id', otherKey: 'groupId', onDelete: 'CASCADE', hooks: true }
      );
      Event.belongsTo(
        models.Venue,
        { as: 'eventVenue', foreignKey: 'venueId' }
      );
      Event.hasMany(
        models.Image,
        { as: 'EventImages', foreignKey: 'imageableId', constraints: false, onDelete: 'CASCADE', hooks: true, scope: { imageableType: 'Event' } } 
      );
      Event.hasMany(
        models.Attendance,
        { foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true }
      );
    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    venueId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 60]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidField(value) {
          if (value !== "Online" && value !== "In person") {
            throw new Error("Type must be 'Online' or 'In person'");
          }
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   isAfter: Date.now()
      // }
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   isAfter: this.startDate
      // }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
