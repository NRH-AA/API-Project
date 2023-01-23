'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: '../reviewImages1.png'
      },
      {
        reviewId: 1,
        url: '../reviewImages2.png'
      },
      {
        reviewId: 2,
        url: '../reviewImages3.png'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {[Op.in]: ['../reviewImages1.png', '../reviewImages2.png', '../reviewImages3.png']}
    }, {});
  }
};
