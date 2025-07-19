// models/Download.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Download = sequelize.define('Download', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file: {
    type: DataTypes.BLOB('long'),
    allowNull: false
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'downloads',
  timestamps: false
});

module.exports = Download;
