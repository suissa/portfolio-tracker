require('dotenv').config();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

if (!FINNHUB_API_KEY) {
  console.error('FINNHUB_API_KEY environment variable is not set');
  process.exit(1);
}

module.exports = {
  API_KEY: FINNHUB_API_KEY,
  BASE_URL: 'https://finnhub.io/api/v1'
}; 
