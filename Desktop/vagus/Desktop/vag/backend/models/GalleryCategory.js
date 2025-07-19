// GalleryCategory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GalleryCategory = sequelize.define('GalleryCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'categories',  // Use the actual table name here
  timestamps: false,
});

module.exports = GalleryCategory;
