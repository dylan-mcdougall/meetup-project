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
      references: { model: 'Users', key: 'id', onDelete: 'CASCADE' }
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Groups', key: 'id', onDelete: 'CASCADE' }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
