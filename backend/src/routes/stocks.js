const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const stockPriceService = require('../services/stockPriceService');
const { Op } = require('sequelize');
const { finnhubClient } = require('../config/finnhub');

// Get all stocks
router.get('/', async (req, res) => {
  try {
    console.log('Fetching stocks...');
    const stocks = await Stock.findAll({
      where: {
        shares: {
          [Op.gt]: 0
        }
      },
      order: [['name', 'ASC']]
    });
    console.log(`Found ${stocks.length} stocks`);
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

// Get historical data for a stock
router.get('/:ticker/history', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { resolution = 'D', from, to } = req.query;

    const historicalData = await stockPriceService.getHistoricalData(
      ticker,
      resolution,
      from ? parseInt(from) : null,
      to ? parseInt(to) : null
    );

    if (!historicalData) {
      return res.status(404).json({ error: 'No historical data available' });
    }

    res.json(historicalData);
  } catch (err) {
    console.error('Error fetching historical data:', err);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Get real-time quote for a stock
router.get('/:ticker/quote', async (req, res) => {
  try {
    const { ticker } = req.params;
    const quote = await stockPriceService.getQuote(ticker);

    if (!quote) {
      return res.status(404).json({ error: 'Quote not available' });
    }

    res.json(quote);
  } catch (err) {
    console.error('Error fetching quote:', err);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Add new stock
router.post('/', async (req, res) => {
  try {
    const { name, ticker, shares, buy_price, target_price } = req.body;
    console.log('Received request to add stock:', req.body);

    // Validate required fields
    if (!name || !ticker || !shares || !buy_price) {
      console.error('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate numeric values
    const parsedShares = parseFloat(shares);
    const parsedBuyPrice = parseFloat(buy_price);
    const parsedTargetPrice = parseFloat(target_price || buy_price); // Use buy_price as default target_price

    if (isNaN(parsedShares) || parsedShares <= 0) {
      console.error('Invalid number of shares:', shares);
      throw new Error('Invalid number of shares');
    }

    if (isNaN(parsedBuyPrice) || parsedBuyPrice <= 0) {
      console.error('Invalid buy price:', buy_price);
      throw new Error('Invalid buy price');
    }

    console.log('Fetching current price for ticker:', ticker);
    // Get current price from Finnhub
    const quote = await stockPriceService.getStockQuote(ticker);
    console.log('Received quote:', quote);
    
    if (!quote || !quote.c) {
      console.error('Failed to fetch quote for ticker:', ticker);
      throw new Error('Unable to fetch current price for ticker');
    }

    console.log('Creating stock in database');
    const stock = await Stock.create({
      name: name.trim(),
      ticker: ticker.toUpperCase().trim(),
      shares: parsedShares,
      buy_price: parsedBuyPrice,
      current_price: quote.c,
      target_price: parsedTargetPrice,
      is_in_watchlist: false,
      last_updated: new Date()
    });

    console.log('Stock added successfully:', stock.id);
    res.status(201).json(stock);
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(400).json({ error: error.message || 'Failed to add stock' });
  }
});

// Update stock
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ticker, shares, buy_price } = req.body;
    console.log('Updating stock:', id, { name, ticker, shares, buy_price });

    const stock = await Stock.findByPk(id);
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    // Validate numeric values if provided
    let parsedShares = shares !== undefined ? parseFloat(shares) : stock.shares;
    let parsedBuyPrice = buy_price !== undefined ? parseFloat(buy_price) : stock.buy_price;

    if (shares !== undefined && (isNaN(parsedShares) || parsedShares < 0)) {
      throw new Error('Invalid number of shares');
    }

    if (buy_price !== undefined && (isNaN(parsedBuyPrice) || parsedBuyPrice < 0)) {
      throw new Error('Invalid buy price');
    }

    // Get current price from Finnhub if ticker changed
    let current_price = stock.current_price;
    if (ticker && ticker !== stock.ticker) {
      const quote = await stockPriceService.getStockQuote(ticker);
      if (!quote || !quote.c) {
        throw new Error('Unable to fetch current price for ticker');
      }
      current_price = quote.c;
    }

    await stock.update({
      name: name ? name.trim() : stock.name,
      ticker: ticker ? ticker.toUpperCase().trim() : stock.ticker,
      shares: parsedShares,
      buy_price: parsedBuyPrice,
      current_price,
      last_updated: new Date()
    });

    console.log('Stock updated:', id);
    res.json(stock);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(400).json({ error: error.message || 'Failed to update stock' });
  }
});

// Delete stock
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting stock:', id);

    const stock = await Stock.findByPk(id);
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    await stock.destroy();
    console.log('Stock deleted:', id);
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: 'Failed to delete stock' });
  }
});

// Get portfolio summary
router.get('/summary', async (req, res) => {
  try {
    console.log('Getting portfolio summary...');
    const stocks = await Stock.findAll({
      where: {
        shares: {
          [Op.gt]: 0
        }
      }
    });

    const summary = {
      totalValue: 0,
      totalGain: 0,
      totalGainPercent: 0,
      stockCount: stocks.length
    };

    for (const stock of stocks) {
      const stockValue = stock.shares * stock.current_price;
      const stockCost = stock.shares * stock.buy_price;
      const stockGain = stockValue - stockCost;

      summary.totalValue += stockValue;
      summary.totalGain += stockGain;
    }

    if (summary.totalValue > 0) {
      summary.totalGainPercent = (summary.totalGain / (summary.totalValue - summary.totalGain)) * 100;
    }

    console.log('Portfolio summary:', summary);
    res.json(summary);
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({ error: 'Failed to get portfolio summary' });
  }
});

// Get stock price history
router.get('/history/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    
    // Generate sample historical data for the last 30 days
    const history = [];
    const today = new Date();
    let currentPrice = (await stockPriceService.getQuote(ticker))?.currentPrice || 100;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Add some random variation to create realistic-looking price movements
      const randomChange = (Math.random() - 0.5) * 5; // Random change between -2.5 and 2.5
      currentPrice = Math.max(currentPrice + randomChange, 1); // Ensure price doesn't go below 1
      
      history.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(currentPrice.toFixed(2))
      });
    }
    
    res.json({ history });
  } catch (error) {
    console.error('Error fetching stock history:', error);
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
});

// Get historical data for a stock
router.get('/:ticker/historical', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period = '1D' } = req.query;

    let resolution;
    let from;
    const to = Math.floor(Date.now() / 1000);

    switch (period) {
      case '1D':
        resolution = '5';
        from = to - 24 * 60 * 60;
        break;
      case '1W':
        resolution = '15';
        from = to - 7 * 24 * 60 * 60;
        break;
      case '1M':
        resolution = '60';
        from = to - 30 * 24 * 60 * 60;
        break;
      case '3M':
        resolution = 'D';
        from = to - 90 * 24 * 60 * 60;
        break;
      case '1Y':
        resolution = 'D';
        from = to - 365 * 24 * 60 * 60;
        break;
      case 'ALL':
        resolution = 'W';
        from = to - 5 * 365 * 24 * 60 * 60;
        break;
      default:
        resolution = '5';
        from = to - 24 * 60 * 60;
    }

    const data = await finnhubClient.stockCandles(ticker, resolution, from, to);
    
    if (data.s !== 'ok') {
      throw new Error('Failed to fetch historical data');
    }

    const historicalData = data.t.map((timestamp, index) => ({
      time: new Date(timestamp * 1000).toISOString(),
      price: data.c[index]
    }));

    res.json(historicalData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

module.exports = router; 