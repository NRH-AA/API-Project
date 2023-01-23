'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {foreignKey: 'ownerId', as: 'Owner'});
      Spot.hasMany(models.SpotImage, {foreignKey: 'spotId', as: 'spotImages'});
      Spot.hasMany(models.Review, {foreignKey: 'spotId'});
      Spot.hasOne(models.Booking, {foreignKey: 'spotid'});
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.FLOAT(9, 7),
      defaultValue: 0.0
    },
    lng: {
      type: DataTypes.FLOAT(10, 7),
      defaultValue: 0.0
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {len: [5, 500]}
    },
    price: {
      type:DataTypes.FLOAT(5, 2),
      allowNull: false
    },
    avgRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
