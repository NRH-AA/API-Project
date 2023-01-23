'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

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
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, bookings, {
      validate: true
    });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    for (let i = 0; i < reviews.length; i++) {
      await queryInterface.delete(options, {
        spotId: reviews[i].spotId,
        userId: reviews[i].userId
      }, {});
    }
  }
};
