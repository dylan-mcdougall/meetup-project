'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Membership.belongsTo(
        models.User,
        { foreignKey: 'userId', targetKey: 'id' }
      );
      Membership.belongsTo(
        models.Group,
        { foreignKey: 'groupId', targetKey: 'id' }
      );
    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id', onDelete: 'CASCADE', hooks: true }
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Groups', key: 'id', onDelete: 'CASCADE', hooks: true }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidField(value) {
          if (value !== 'member' && value !== 'co-host' && value !== 'host' && value !== 'pending') {
            throw new Error('Invalid status field')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
