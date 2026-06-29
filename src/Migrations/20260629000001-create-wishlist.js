'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wishlists', {
      id:         { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      userId:     { type: Sequelize.INTEGER, allowNull: false },
      product:    { type: Sequelize.STRING, allowNull: false },
      cost:       { type: Sequelize.STRING },
      image_path: { type: Sequelize.STRING },
      createdAt:  { allowNull: false, type: Sequelize.DATE },
      updatedAt:  { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Wishlists');
  }
};
