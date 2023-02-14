'use strict';

const { seedBookings } = require('../../utils/seed.js');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    
    const bookings = seedBookings(5);
    
    await queryInterface.bulkInsert(options, bookings);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {[Op.gte]: 0}
    });
  }
};
