'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Venue.hasMany(
        models.Event,
        { foreignKey: 'venueId', onDelete: 'CASCADE', hooks: true }
      );
      Venue.belongsTo(
        models.Group,
        { foreignKey: 'groupId' }
      );
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Groups', key: 'id', onDelete: 'CASCADE', hooks: true }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {
        isUppercase: true
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
