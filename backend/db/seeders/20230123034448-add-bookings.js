'use strict';

const { Booking } = require('../models');

const bookings = [
  {
    spotId: 1,
    userId: 2,
    startDate: new Date('2023-1-25'),
    endDate: new Date('2023-1-28')
  },
  {
    spotId: 3,
    userId: 1,
    startDate: new Date('2023-1-25'),
    endDate: new Date('2023-1-28')
  },
  {
    spotId: 2,
    userId: 3,
    startDate: new Date('2023-1-25'),
    endDate: new Date('2023-1-28')
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bookings', bookings, {
      validate: true
    });
    
    
  },

  async down (queryInterface, Sequelize) {
    for (let i = 0; i < bookings.length; i++) {
      const tmpBooking = await Booking.findOne({
        where: {
          spotId: bookings[i].spotId,
          userId: bookings[i].userId
        }
      });
      
      if (tmpBooking) await tmpBooking.destroy();
    }
    
    
  }
};
