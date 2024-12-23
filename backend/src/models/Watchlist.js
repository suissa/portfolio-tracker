const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Watchlist = sequelize.define('Watchlist', {
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
  target_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  current_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  last_updated: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'watchlists',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Watchlist; 