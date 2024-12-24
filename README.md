# Stock Portfolio Tracker 📈

<div align="center">

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-tracker-hackstyx.vercel.app)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://portfolio-tracker-backend-y7ne.onrender.com/api)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Finnhub](https://img.shields.io/badge/Finnhub-1B1B1B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMyA2aDJsMTUgMk0xNyA2djE0TTcgMTZoMTAiLz48L3N2Zz4=)](https://finnhub.io/)

<p align="center">
  <strong>A modern, responsive stock portfolio tracker built with React and Node.js</strong>
</p>

[Live Demo](https://portfolio-tracker-hackstyx.vercel.app) • [API Documentation](#-api-endpoints) • [Report Bug](https://github.com/HackStyx/portfolio-tracker/issues)

> **Note**: Due to the free tier limitations of Render, the initial load of the demo might take 30-60 seconds. If no data appears, please refresh the page. If issues persist, click the logout button to reset the application state. The backend spins down after 15 minutes of inactivity and needs time to restart.

![Portfolio Dashboard](https://github.com/user-attachments/assets/c18f253c-2ac2-4df9-8025-c91858b74237)

</div>

## ✨ Features

- 📊 **Portfolio Management** - Track your stocks with real-time updates
- 👀 **Watchlist** - Monitor potential investments
- 🌓 **Dark/Light Mode** - Easy on the eyes, day and night
- 📱 **Fully Responsive** - Perfect on desktop and mobile
- 🔄 **Live Updates** - Real-time stock prices via Finnhub API
- 📈 **Price History** - Visualize stock performance with historical data
- 💹 **Market Data** - Real-time quotes and market status tracking
- 🎯 **Price Targets** - Set and monitor stock price targets

## 🚀 Quick Start

### Prerequisites

- Node.js 14+
- npm or yarn
- MySQL
- Finnhub API Key (get one at [finnhub.io](https://finnhub.io/))

### Frontend Setup

1. Clone and install:
```bash
git clone https://github.com/HackStyx/portfolio-tracker.git
cd portfolio-tracker
npm install
```

2. Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

### Backend Setup

1. Setup backend:
```bash
cd backend
npm install
```

2. Configure `.env`:
```env
DATABASE_URL=mysql://user:password@localhost:3306/portfolio_tracker
PORT=5000
NODE_ENV=development
FINNHUB_API_KEY=your_finnhub_api_key
```

3. Run migrations and start:
```bash
npm run migrate
npm start
```

## 🔌 API Endpoints

### Base URL
```
https://portfolio-tracker-backend-y7ne.onrender.com/api
```

### Portfolio

```
GET     /api/stocks           # Get portfolio stocks
POST    /api/stocks           # Add stock
PUT     /api/stocks/:id       # Update stock
DELETE  /api/stocks/:id       # Remove stock
```

### Watchlist

```
GET     /api/watchlist           # Get watchlist
POST    /api/watchlist           # Add to watchlist
PUT     /api/watchlist/:id       # Update watchlist item
DELETE  /api/watchlist/:id       # Remove from watchlist
```

## ⚡️ Tech Stack

### 🎨 Frontend
- **Framework**: [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- **Build Tool**: [Vite](https://vitejs.dev/) - Next generation frontend tooling
- **Styling**: 
  - [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [Tremor](https://www.tremor.so/) - React library for dashboards and charts
  - [Framer Motion](https://www.framer.com/motion/) - Animation library
- **State Management**: React Context API
- **HTTP Client**: [Axios](https://axios-http.com/) - Promise based HTTP client

### 🛠 Backend
- **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime
- **Framework**: [Express](https://expressjs.com/) - Web framework for Node.js
- **Database**: [MySQL](https://www.mysql.com/) - Open-source relational database
- **ORM**: [Sequelize](https://sequelize.org/) - Modern TypeScript and Node.js ORM
- **Market Data**: [Finnhub](https://finnhub.io/) - Real-time RESTful APIs for stocks
- **API Documentation**: OpenAPI/Swagger

### 🚀 DevOps & Infrastructure
- **Frontend Hosting**: [Vercel](https://vercel.com/)
  - Zero-config deployments
  - Automatic HTTPS
  - Edge Network for optimal performance
- **Backend Hosting**: [Render](https://render.com/)
  - Containerized deployment
  - Automatic scaling
  - Built-in monitoring
- **Database Hosting**: [Railway](https://railway.app/)
  - Managed MySQL database
  - Automated backups
  - High availability

### 📦 Additional Tools
- **Version Control**: Git & GitHub
- **Code Quality**: ESLint & Prettier
- **API Testing**: Postman
- **Environment Variables**: dotenv
- **Security**: CORS, Helmet
- **Real-time Data**: WebSocket (planned)

## ⚠️ Limitations

- Uses simulated stock data when Finnhub API rate limit is reached
- Single-user environment
- Price updates every minute
- Best viewed in modern browsers
- Backend spins down after 15 minutes of inactivity and needs time to restart
- Limited to 60 API calls per minute (Finnhub free tier)

## 📄 License

MIT © [HackStyx](LICENSE)
