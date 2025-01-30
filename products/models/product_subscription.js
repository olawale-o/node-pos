"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductSubscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductSubscription.belongsTo(models.Product, {
        as: "subscription",
        foreignKey: {
          name: "product_id",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "CASCADE",
      });
      ProductSubscription.belongsTo(models.User, {
        as: "product_subscribers",
        foreignKey: {
          name: "user_id",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "CASCADE",
      });
    }
  }
  ProductSubscription.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_id",
        references: {
          model: {
            tableName: "products",
          },
          key: "id",
        },
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
      subscribedAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "subscribed_at",
      },
    },
    {
      sequelize,
      modelName: "ProductSubscription",
      tableName: "products_subscriptions",
      createdAt: "created_at",
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "product_id", "subscribed_at"],
        },
      ],
    },
  );
  return ProductSubscription;
};
