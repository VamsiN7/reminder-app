const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('reminderDB', 'postgres', 'vamsi', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
