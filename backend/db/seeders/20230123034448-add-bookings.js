'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
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
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {[Op.in]: [1, 2, 3]},
      userId: {[Op.in]: [1, 2, 3]}
    }, {});
  }
};
