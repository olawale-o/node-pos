"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product_Subscription.belongsTo(models.Product, {
        as: "subscription",
        foreignKey: {
          name: "product_id",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "CASCADE",
      });
    }
  }
  Product_Subscription.init(
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
      modelName: "Product_Subscription",
      tableName: "products_subscriptions",
      createdAt: "created_at",
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "proudct_id", "subscribed_at"],
        },
      ],
    },
  );
  return Product_Subscription;
};
