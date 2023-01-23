'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options, [
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
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: {[Op.in]: ['123 Main Street', '445 Sever Road', '514 Cuger Blvd']}
    }, {});
  }
};
