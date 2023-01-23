'use strict';

const { Review } = require('../models');

const reviews = [
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
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', reviews, {
      validate: true
    });
    
  },

  async down (queryInterface, Sequelize) {
    for (let i = 0; i < reviews.length; i++) {
      const tmpReview = await Review.findOne({
        where: {
          spotId: reviews[i].spotId,
          userId: reviews[i].userId
        }
      });
      
      if (tmpReview) await tmpReview.destroy();
    }
    
    
  }
};
