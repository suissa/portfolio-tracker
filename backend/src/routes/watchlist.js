const express = require('express');
const router = express.Router();
const { Stock } = require('../models/stock');
const stockPriceService = require('../services/stockPriceService');
const { Op } = require('sequelize');

// Get all watchlist stocks
router.get('/', async (req, res) => {
  try {
    console.log('Fetching watchlist stocks');
    const stocks = await Stock.findAll({
      where: { is_in_watchlist: true },
      order: [['name', 'ASC']]
    });
    console.log('Found watchlist stocks:', stocks.length);
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Add stock to watchlist
router.post('/', async (req, res) => {
  try {
    const { name, ticker, target_price } = req.body;
    console.log('Adding stock to watchlist:', { name, ticker, target_price });

    // Validate numeric values
    const parsedTargetPrice = parseFloat(target_price);
    if (isNaN(parsedTargetPrice) || parsedTargetPrice <= 0) {
      throw new Error('Invalid target price');
    }

    // Get current price from Finnhub
    const quote = await stockPriceService.getStockQuote(ticker);
    if (!quote || !quote.c) {
      throw new Error('Unable to fetch current price for ticker');
    }

    const stock = await Stock.create({
      name: name.trim(),
      ticker: ticker.toUpperCase().trim(),
      shares: 0,
      buy_price: 0,
      current_price: quote.c,
      target_price: parsedTargetPrice,
      is_in_watchlist: true,
      last_updated: new Date()
    });

    console.log('Stock added to watchlist:', stock.id);
    res.status(201).json(stock);
  } catch (error) {
    console.error('Error adding stock to watchlist:', error);
    res.status(400).json({ error: error.message || 'Failed to add stock to watchlist' });
  }
});

// Sync portfolio stocks to watchlist
router.post('/sync-portfolio', async (req, res) => {
  try {
    console.log('Syncing portfolio stocks to watchlist');
    const portfolioStocks = await Stock.findAll({
      where: { shares: { [Op.gt]: 0 } }
    });

    console.log('Found portfolio stocks:', portfolioStocks.length);

    for (const stock of portfolioStocks) {
      // If no target price is set, use current price + 10%
      if (!stock.target_price) {
        await stock.update({
          is_in_watchlist: true,
          target_price: stock.current_price * 1.1
        });
      } else {
        await stock.update({ is_in_watchlist: true });
      }
    }

    console.log('Portfolio stocks synced to watchlist');
    res.json({ message: 'Portfolio stocks synced to watchlist' });
  } catch (error) {
    console.error('Error syncing portfolio stocks:', error);
    res.status(500).json({ error: 'Failed to sync portfolio stocks' });
  }
});

// Delete stock from watchlist
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting stock from watchlist:', req.params.id);
    const stock = await Stock.findByPk(req.params.id);
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    if (stock.shares > 0) {
      // If stock is in portfolio, just remove from watchlist
      await stock.update({ is_in_watchlist: false });
    } else {
      // If stock is not in portfolio, delete it completely
      await stock.destroy();
    }

    console.log('Stock removed from watchlist');
    res.json({ message: 'Stock removed from watchlist' });
  } catch (error) {
    console.error('Error deleting stock from watchlist:', error);
    res.status(500).json({ error: 'Failed to delete stock from watchlist' });
  }
});

// Update stock target price
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { target_price } = req.body;
    console.log('Updating stock target price:', { id, target_price });

    // Validate numeric values
    const parsedTargetPrice = parseFloat(target_price);
    if (isNaN(parsedTargetPrice) || parsedTargetPrice <= 0) {
      throw new Error('Invalid target price');
    }

    const stock = await Stock.findByPk(id);
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    await stock.update({
      target_price: parsedTargetPrice,
      last_updated: new Date()
    });

    console.log('Stock target price updated:', stock.id);
    res.json(stock);
  } catch (error) {
    console.error('Error updating stock target price:', error);
    res.status(400).json({ error: error.message || 'Failed to update stock target price' });
  }
});

// Get stock price history
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findByPk(id);
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    try {
      const historicalData = await stockPriceService.getHistoricalData(stock.ticker);
      res.json(historicalData);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      
      // Fallback to mock data if API fails
      const today = new Date();
      const mockPriceHistory = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (29 - i));
        
        const basePrice = parseFloat(stock.current_price);
        const randomVariation = (Math.random() - 0.5) * 0.1;
        const price = basePrice * (1 + randomVariation);

        return {
          timestamp: date.toISOString(),
          price: price.toFixed(2)
        };
      });

      res.json(mockPriceHistory);
    }
  } catch (error) {
    console.error('Error in price history endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch stock price history' });
  }
});

module.exports = router; 