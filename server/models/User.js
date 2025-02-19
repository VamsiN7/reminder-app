// backend/models/User.js
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
    allowNull: true,
    field: 'graduationdate'  // maps to the actual column in DB
  },
  phone: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  notifyEmail: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
    field: 'notifyemail'  // maps to the actual column in DB
  },
  goal: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'goal'
  },
  notifySMS: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
    field: 'notifysms'  // maps to the actual column in DB
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;