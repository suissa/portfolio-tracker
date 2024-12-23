const Stock = require('../models/Stock');
const sequelize = require('../config/database');

async function initializeDatabase() {
  try {
    // Sync all models with the database
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');

    // Create some initial stocks for testing
    await Stock.bulkCreate([
      {
        name: 'Apple Inc.',
        ticker: 'AAPL',
        shares: 10,
        buy_price: 150.00,
        current_price: 155.00,
        target_price: 180.00,
        is_in_watchlist: false
      },
      {
        name: 'Microsoft Corporation',
        ticker: 'MSFT',
        shares: 5,
        buy_price: 280.00,
        current_price: 290.00,
        target_price: 320.00,
        is_in_watchlist: false
      }
    ]);
    console.log('Initial stocks created successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { initializeDatabase }; 