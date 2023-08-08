'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendance.belongsTo(
        models.Event,
        { foreignKey: 'eventId', targetKey: 'id' }
      );
      Attendance.belongsTo(
        models.User,
        { foreignKey: 'userId', targetKey: 'id' }
      );
    }
  }
  Attendance.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id', onDelete: 'CASCADE', hooks: true }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Events', otherKey: 'id', onDelete: 'CASCADE', constraints: false, hooks: true }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidField(value) {
          if (value !== "attending" && value !== "waitlist" && value !== "pending") {
            throw new Error("Status must be attending, waitlist, or pending")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
