'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id:            { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      userId:        { type: Sequelize.INTEGER, allowNull: false },
      items:         { type: Sequelize.TEXT },
      totalAmount:   { type: Sequelize.DECIMAL(10, 2) },
      paymentMethod: { type: Sequelize.STRING },
      status:        { type: Sequelize.ENUM('pending','paid','shipped','delivered','cancelled'), defaultValue: 'pending' },
      transactionId: { type: Sequelize.STRING },
      createdAt:     { allowNull: false, type: Sequelize.DATE },
      updatedAt:     { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Orders');
  }
};
