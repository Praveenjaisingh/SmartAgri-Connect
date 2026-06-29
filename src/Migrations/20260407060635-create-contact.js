'use strict';

const { sequelize } = require('../Models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
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
      message: {
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
    await queryInterface.dropTable('Contacts');
  }
};