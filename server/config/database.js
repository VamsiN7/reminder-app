const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER ,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST, 
    dialect: 'postgres',
    logging: false,
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
  }
);

module.exports = sequelize;