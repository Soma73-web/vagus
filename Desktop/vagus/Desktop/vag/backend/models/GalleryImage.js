// models/GalleryImage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GalleryImage = sequelize.define('GalleryImage', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.BLOB('long'),
    allowNull: false
  },
  image_type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'gallery_images',
  timestamps: false
});

module.exports = GalleryImage;
