"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ScheduledNotifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ScheduledNotifications.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      notificationType: {
        type: DataTypes.ENUM("transactional", "promotional", "alerts"),
        allowNull: false,
        field: "notification_type",
      },
      channels: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        get() {
          return this.getDataValue("channels").split(",");
        },
        set(val) {
          this.setDataValue("channels", val.join(","));
        },
      },
      scheduledTime: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "scheduled_time",
      },

      //timezone: get it from user preference
      messageContent: {
        allowNull: false,
        type: DataTypes.JSON,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM("pending", "delievered"),
        defaultValue: "pending",
      },
      retries_left: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      priority: {
        allowNull: false,
        type: DataTypes.ENUM("high", "medium", "low"),
        defaultValue: "high",
      },
    },
    {
      sequelize,
      modelName: "ScheduledNotifications",
      updatedAt: false,
      createdAt: "created_at",
    },
  );
  return ScheduledNotifications;
};
