"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.ProductSubscription, {
        as: "subscriptions",
        foreignKey: {
          name: "product_id",
        },
      });
      Product.belongsToMany(models.User, {
        through: models.ProductSubscription,
        as: "subscribers",
        foreignKey: "product_id",
      });
    }
  }
  Product.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Product;
};
