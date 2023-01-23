'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: '../spotImage1.png',
        preview: true
      },
      {
        spotId: 1,
        url: '../spotImage2.png',
        preview: false
      },
      {
        spotId: 2,
        url: '../spotImage3.png',
        preview: true
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {[Op.in]: ['../spotImage1.png', '../spotImage2.png', '../spotImage3.png']}
    }, {});
  }
};
