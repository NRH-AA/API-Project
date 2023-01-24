'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    
    
    static associate(models) {
      Review.belongsTo(models.Spot, {foreignKey: 'spotId'});
      Review.hasMany(models.ReviewImage, {foreignKey: 'reviewId'});
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {len: [5, 500]}
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
