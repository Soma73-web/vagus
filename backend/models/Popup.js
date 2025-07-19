const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Popup = sequelize.define('Popup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "NEET Success Workshop: From Preparation to Achievement"
  },
  speaker: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Dr. Sarah Johnson"
  },
  affiliation: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Senior Medical Officer, AIIMS Delhi"
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageData: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },
  imageMimeType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  displayDelay: {
    type: DataTypes.INTEGER, // Delay in seconds before showing popup
    allowNull: false,
    defaultValue: 5
  }
}, {
  tableName: 'popups',
  timestamps: true
});

module.exports = Popup; 