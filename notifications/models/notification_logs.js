'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notification_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notification_logs.init({
    userId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'notification_logs',
  });
  return notification_logs;
};