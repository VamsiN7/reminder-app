const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  graduationDate: { 
    type: DataTypes.DATEONLY, 
    allowNull: true 
  },
  phone: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  notifyEmail: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  notifySMS: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
