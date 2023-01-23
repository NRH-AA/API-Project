'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');

const spots = [
  {
    ownerId: 1,
    address: '123 Main Street',
    city: 'Portland',
    state: 'Oregon',
    country: 'United States',
    name: 'BestSpot',
    description: 'MoreThan5Chars',
    price: 200,
  },
  {
    ownerId: 1,
    address: '445 Sever Road',
    city: 'Portland',
    state: 'Oregon',
    country: 'United States',
    name: 'OkaySpot',
    description: 'MoreThan6Chars',
    price: 150,
  },
  {
    ownerId: 2,
    address: '514 Cuger Blvd',
    city: 'New York',
    state: 'New York',
    country: 'United States',
    name: 'BadSpot',
    description: 'MoreThan7Chars',
    price: 50,
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spots', spots, {
      validate: true
    });
    
    
  },

  async down (queryInterface, Sequelize) {
    for (let i = 0; i < spots.length; i++) {
      const tmpSpot = await Spot.findOne({
        where: {address: spots[i].address}
      });
      
      if (tmpSpot) await tmpSpot.destroy();
    }
    
    
  }
};
