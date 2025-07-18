const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, 'isrgrootx1.pem'))
    }
  },
  logging: false // set to true for query logs
});

module.exports = sequelize;
