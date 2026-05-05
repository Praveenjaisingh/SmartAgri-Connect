'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Homes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product:{
        allowNull: true,
        type: Sequelize.STRING
      },
      cost:{
        allowNull: true,
        type: Sequelize.STRING
      },
      Quantity:{
        allowNull: true,
        type: Sequelize.STRING
      },
      price:{
        type: Sequelize.STRING
      },
      image_path: {
        allowNull: true,
         type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Homes');
  }
};