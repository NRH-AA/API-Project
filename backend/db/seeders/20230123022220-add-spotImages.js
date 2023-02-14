'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const spotImages = [
  {
    spotId: 1,
    preview: true,
    url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-45598340/original/363fa0a3-746e-4bea-8437-2a33363b3827.jpeg?im_w=720'
  },
  {
    spotId: 1,
    preview: false,
    url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-45598340/original/12ed4147-3913-49f5-bd0b-050c11fcd29d.jpeg?im_w=480'
  },
  {
    spotId: 1,
    preview: false,
    url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-45598340/original/12fa8b9e-39bd-44a9-be67-fe772dcd3b9f.jpeg?im_w=480'
  },
  {
    spotId: 2,
    preview: true,
    url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-655867506785677823/original/4390683f-f150-44be-93ce-88d3ee2dabd4.jpeg?im_w=720'
  },
  {
    spotId: 3,
    preview: true,
    url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-41274565/original/b582fe11-660f-48ce-b176-c78fb67b23e0.jpeg?im_w=720'
  },
  {
    spotId: 4,
    preview: true,
    url: 'https://a0.muscache.com/im/pictures/159179b0-91fe-4101-acd5-4dfcd931f9b0.jpg?im_w=720'
  },
  {
    spotId: 5,
    preview: true,
    url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-700846436964575059/original/4d514b87-5492-4e18-b90e-07aaf3395617.jpeg?im_w=720'
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    
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
