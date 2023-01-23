'use strict';

const { ReviewImage } = require('../models');

const images = [
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
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReviewImages', images, {
      validate: true
    });
    
    
  },

  async down (queryInterface, Sequelize) {
    for (let i = 0; i < images.length; i++) {
      const tmpImg = await ReviewImage.findOne({
        where: {
          reviewId: images[i].reviewId,
          url: images[i].url
        }
      });
      
      if (tmpImg) await tmpImg.destroy();
    }
    
    
  }
};
