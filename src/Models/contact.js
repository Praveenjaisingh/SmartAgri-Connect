'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contact.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    product: DataTypes.STRING,
    cost: DataTypes.STRING,
    Quantity: DataTypes.STRING,
    message: DataTypes.STRING,
    image_path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Contact',
  });
  return contact;
};