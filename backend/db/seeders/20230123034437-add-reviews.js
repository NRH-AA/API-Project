'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 3,
        userId: 1,
        review: "The spot was dirty, grimy, and nasty. Do not go!",
        stars: 0
      },
      {
        spotId: 2,
        userId: 2,
        review: "It was okay, it could of done with some dusting. The Spa out back was great though.",
        stars: 3
      },
      {
        spotId: 1,
        userId: 3,
        review: "This place was fantastic! If you need a place in the area this is the one for you.",
        stars: 5
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {[Op.in]: [1, 2, 3]},
      userId: {[Op.in]: [1, 2, 3]}
    }, {});
  }
};
