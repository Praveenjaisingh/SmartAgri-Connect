'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Order.init({
    userId:       { type: DataTypes.INTEGER, allowNull: false },
    items:        { type: DataTypes.TEXT },      // JSON string of cart items
    totalAmount:  { type: DataTypes.DECIMAL(10,2) },
    paymentMethod:{ type: DataTypes.STRING },    // 'card' | 'upi'
    status:       { type: DataTypes.ENUM('pending','paid','shipped','delivered','cancelled'), defaultValue: 'pending' },
    transactionId:{ type: DataTypes.STRING },
  }, {
    sequelize,
    modelName: 'Order',
    timestamps: true,
  });
  return Order;
};
