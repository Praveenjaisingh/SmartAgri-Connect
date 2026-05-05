'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    const now = new Date();

    await queryInterface.bulkInsert('Homes', [
      {
        product: 'Corn',
        cost: '120',
        Quantity: '1',
        price: '1100',
        image_path: 'image/corn.jpg',
        createdAt: now,
        updatedAt: now
      },
      {
        product: 'Rice',
        cost: '72',
        Quantity: '1',
        price: '1728',
        image_path: 'image/rice.jpg',
        createdAt: now,
        updatedAt: now
      },
      {
        product: 'Potatoes',
        cost: '80',
        Quantity: '1',
        price: '780',
        image_path: 'image/potato.jpg',
        createdAt: now,
        updatedAt: now
      },
      {
        product: 'Tomatoes',
        cost: '140',
        Quantity: '1',
        price: '1360',
        image_path: 'image/tomato.jpg',
        createdAt: now,
        updatedAt: now
      },
      {
        product: 'Carrot',
        cost: '180',
        Quantity: '1',
        price: '1080',
        image_path: 'image/carrot.jpg',
        createdAt: now,
        updatedAt: now
      },
      {
        product: 'Ice Apple',
        cost: '90',
        Quantity: '10 pieces',
        price: '860',
        image_path: 'image/ice apple.jpg',
        createdAt: now,
        updatedAt: now
      },
      {
        product: 'Mango',
        cost: '80',
        Quantity: '1',
        price: '780',
        image_path: 'image/mango.jpg',
        createdAt: now,
        updatedAt: now
      },
      {
        product: 'Wheat',
        cost: '200',
        Quantity: '1',
        price: '1800',
        image_path: 'image/wheat.jpg',
        createdAt: now,
        updatedAt: now
      },
      {
        product: 'Nuts',
        cost: '300',
        Quantity: '1',
        price: '2700',
        image_path: 'image/nuts.jpg',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Homes', null, {});
  }
};