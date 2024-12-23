const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ticker: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shares: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  buy_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  current_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  target_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  is_in_watchlist: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  last_updated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'stocks'
});

module.exports = Stock; 