'use strict';

const { seedSpots } = require('../../utils/seed.js');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    
    const spots = seedSpots(100);
    
    await queryInterface.bulkInsert(options, spots);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {[Op.gte]: 0}
    });
  }
};
