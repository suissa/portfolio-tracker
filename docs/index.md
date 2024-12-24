---
layout: default
title: Stock Portfolio Tracker API
description: A comprehensive guide to integrating with our real-time portfolio management solution
nav_order: 1
permalink: /
---

# Stock Portfolio Tracker API Documentation

A modern REST API for real-time stock portfolio management with Finnhub integration.

<div class="buttons-container" markdown="1">
[Get Started](#getting-started){: .btn .btn-blue .mr-2}
[View on GitHub](https://github.com/HackStyx/portfolio-tracker){: .btn}
</div>

## Overview

The Stock Portfolio Tracker API provides a comprehensive suite of endpoints for managing stock portfolios and watchlists. Built with Node.js and Express, it offers real-time market data integration through Finnhub API.

### Key Features

- 📊 Real-time Portfolio Management
- 👀 Watchlist Functionality
- 💹 Live Market Data
- 📈 Historical Price Tracking
- 🎯 Price Target Monitoring
- 📱 RESTful Architecture

## Getting Started

### Base URL

```
https://portfolio-tracker-backend-y7ne.onrender.com/api
```

### Authentication

Currently, the API is open and doesn't require authentication. This is a limitation noted in the project documentation.

### Rate Limiting

The API uses Finnhub for market data, which has the following limitations:
- **60 API calls per minute** per API key
- Automatic fallback to simulated data when rate limit is reached
- Cached responses for frequently accessed data

## API Reference

### Portfolio Management

#### Get All Stocks

Returns a list of all stocks in the portfolio.

```http
GET /stocks
```

**Response Format:**

```json
[
  {
    "id": 1,
    "name": "Apple Inc.",
    "ticker": "AAPL",
    "shares": 1,
    "buy_price": 175.50,
    "current_price": 180.25,
    "target_price": 200.00,
    "is_in_watchlist": false,
    "last_updated": "2024-01-20T12:00:00Z"
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier for the stock |
| `name` | string | Company name |
| `ticker` | string | Stock symbol |
| `shares` | number | Number of shares owned |
| `buy_price` | number | Purchase price per share |
| `current_price` | number | Current market price |
| `target_price` | number | Target price for alerts |
| `is_in_watchlist` | boolean | Watchlist status |
| `last_updated` | string | Last price update timestamp |

#### Add New Stock

Add a new stock to the portfolio.

```http
POST /stocks
```

**Request Body:**

```json
{
  "name": "Apple Inc.",
  "ticker": "AAPL",
  "shares": 1,
  "buy_price": 175.50,
  "target_price": 200.00
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Company name |
| `ticker` | string | Yes | Stock symbol |
| `shares` | number | Yes | Number of shares |
| `buy_price` | number | Yes | Purchase price |
| `target_price` | number | No | Target price |

**Response:** Returns the created stock object with a `201 Created` status.

#### Update Stock

Update an existing stock's details.

```http
PUT /stocks/:id
```

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Stock ID to update |

**Request Body:**

```json
{
  "shares": 2,
  "buy_price": 180.00,
  "target_price": 210.00
}
```

**Response:** Returns the updated stock object.

#### Delete Stock

Remove a stock from the portfolio.

```http
DELETE /stocks/:id
```

**Response:** Returns `204 No Content` on success.

### Watchlist Management

#### Get Watchlist

```http
GET /watchlist
```

Returns all stocks in the watchlist.

#### Add to Watchlist

```http
POST /watchlist
```

**Request Body:**

```json
{
  "name": "Microsoft Corporation",
  "ticker": "MSFT",
  "target_price": 400.00
}
```

### Market Data

#### Get Stock Quote

```http
GET /stocks/:ticker/quote
```

Get real-time quote for a specific stock.

**Response Example:**

```json
{
  "c": 180.25,  // Current price
  "h": 182.50,  // High price of the day
  "l": 179.75,  // Low price of the day
  "o": 180.00,  // Open price
  "pc": 179.50  // Previous close price
}
```

#### Get Historical Data

```http
GET /stocks/:ticker/history
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `resolution` | string | Data resolution (e.g., "D" for daily) |
| `from` | integer | Start timestamp (Unix) |
| `to` | integer | End timestamp (Unix) |

### Portfolio Analytics

#### Get Portfolio Summary

```http
GET /stocks/summary
```

**Response Example:**

```json
{
  "totalValue": 10000.00,
  "totalGain": 500.00,
  "totalGainPercent": 5.00,
  "stockCount": 5
}
```

## Error Handling

The API uses standard HTTP status codes and provides detailed error messages.

### Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request |
| `404` | Not Found |
| `429` | Too Many Requests |
| `500` | Internal Server Error |

### Error Response Format

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error context"
  }
}
```

## Rate Limiting Strategy

To handle Finnhub API rate limits effectively:

1. **Caching**
   - Stock quotes cached for 1 minute
   - Historical data cached for 1 hour
   - Company information cached for 24 hours

2. **Request Queuing**
   - Implements token bucket algorithm
   - Prioritizes real-time quote requests
   - Queues non-critical updates

3. **Fallback Mechanism**
   - Uses simulated data when rate limited
   - Clearly indicates simulated vs real data
   - Retries failed requests with exponential backoff

## Development Guide

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/HackStyx/portfolio-tracker.git
cd portfolio-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Start development server:
```bash
npm run dev
```

### Testing

Run the test suite:
```bash
npm test
```

### Deployment

The API is deployed on Render with the following configuration:

1. **Environment Variables**
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DATABASE_URL`
   - `FINNHUB_API_KEY`

2. **Build Command**
```bash
npm install && npm run build
```

3. **Start Command**
```bash
npm start
```

## Support & Feedback

- 📝 [Report a Bug](https://github.com/HackStyx/portfolio-tracker/issues/new?template=bug_report.md)
- 💡 [Request a Feature](https://github.com/HackStyx/portfolio-tracker/issues/new?template=feature_request.md)
- 📚 [Documentation Updates](https://github.com/HackStyx/portfolio-tracker/issues/new?template=documentation.md)

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details. 
