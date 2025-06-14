'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    const userId = '109876543210987654321'; // ID unik bohongan
    await queryInterface.bulkInsert('Users', [{
      googleId: userId,
      displayName: 'Dicoding User',
      email: 'dicoding.user@example.com',
      image: 'https://i.pravatar.cc/150?u=dicoding',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('Ootds', [
      {
        id: uuidv4(),
        namaOutfit: 'Gaya Pantai',
        deskripsi: 'Kemeja hawaii dengan celana pendek dan sandal jepit untuk bersantai di pantai.',
        imageId: '/uploads/dummy-image-1.jpg',
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        namaOutfit: 'Gaya Nongkrong Kopi',
        deskripsi: 'Hoodie, ripped jeans, dan sneakers putih. Nyaman dan tetap keren.',
        imageId: '/uploads/dummy-image-2.jpg',
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ootds', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};