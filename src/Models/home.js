'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class home extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  home.init({
    product: DataTypes.STRING,
    cost: DataTypes.STRING,
    Quantity: DataTypes.STRING,
    price: DataTypes.STRING,
    image_path: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Home',
  });
  return home;
};