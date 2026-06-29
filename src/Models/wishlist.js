'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      Wishlist.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Wishlist.init({
    userId:    { type: DataTypes.INTEGER, allowNull: false },
    product:   { type: DataTypes.STRING,  allowNull: false },
    cost:      { type: DataTypes.STRING },
    image_path:{ type: DataTypes.STRING },
  }, {
    sequelize,
    modelName: 'Wishlist',
    timestamps: true,
  });
  return Wishlist;
};
