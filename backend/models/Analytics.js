const { DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const Analytics = sequelize.define('Analytics', {
  date: {
    type: DataTypes.STRING(10), // YYYY-MM-DD
    primaryKey: true,
  },
  hits: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  uniqueVisitors: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  uniqueIps: {
    type: DataTypes.TEXT, // JSON string of IPs
    defaultValue: '[]',
  },
}, {
  tableName: 'analytics',
  timestamps: false,
});

module.exports = Analytics; 