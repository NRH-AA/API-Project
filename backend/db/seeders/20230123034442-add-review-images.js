'use strict';

const { seedReviewImages } = require('../../utils/seed.js');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    
    const reviewImages = seedReviewImages(10);
    
    await queryInterface.bulkInsert(options, reviewImages);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {[Op.gte]: 0}
    });
  }
};
