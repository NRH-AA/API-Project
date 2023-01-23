'use strict';

const { SpotImage } = require('../models');

const images = [
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
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SpotImages', images, {
      validate: true
    });
    
    
  },

  async down (queryInterface, Sequelize) {
    for (let i = 0; i < images.length; i++) {
      const tmpImg = await SpotImage.findOne({
        where: {
          spotId: images[i].spotId,
          url: images[i].url
        }
      });
      
      if (tmpImg) await tmpImg.destroy();
    }
    
    
  }
};
