'use strict';

const { seedSpotImages } = require('../../utils/seed.js');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    
    const spotImages = seedSpotImages(300);
    
    await queryInterface.bulkInsert(options, spotImages);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {[Op.gte]: 0}
    });
  }
};
