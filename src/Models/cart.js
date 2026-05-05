'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cart.init({
    product: DataTypes.STRING,
    cost: DataTypes.STRING,
    Quantity: DataTypes.STRING,
    total: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Cart',
    timestamps: true,   
    paranoid: true 
  });
  return cart;
};