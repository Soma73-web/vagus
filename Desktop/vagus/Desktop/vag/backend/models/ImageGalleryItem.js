// ImageGalleryItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const GalleryCategory = require('./GalleryCategory');

const ImageGalleryItem = sequelize.define('ImageGalleryItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  categoryId: {
    type: DataTypes.INTEGER,
    references: { model: 'categories', key: 'id' },  // Reference correct table
    allowNull: false,
  },
  image: { type: DataTypes.TEXT('long'), allowNull: false },
}, {
  tableName: 'gallery_imagees',  // Use your actual images table name here
  timestamps: false,
});

GalleryCategory.hasMany(ImageGalleryItem, { foreignKey: 'categoryId', as: 'images' });
ImageGalleryItem.belongsTo(GalleryCategory, { foreignKey: 'categoryId' });

module.exports = ImageGalleryItem;
