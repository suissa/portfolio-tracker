# Stock Portfolio Tracker 📈

<div align="center">

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-tracker-hackstyx.vercel.app)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://portfolio-tracker-backend-y7ne.onrender.com/api)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

<p align="center">
  <strong>A modern, responsive stock portfolio tracker built with React and Node.js</strong>
</p>

[Live Demo](https://portfolio-tracker-hackstyx.vercel.app) • [API Endpoint](https://portfolio-tracker-backend-y7ne.onrender.com/api) • [Report Bug](https://github.com/HackStyx/portfolio-tracker/issues)

![Portfolio Dashboard](https://i.imgur.com/your-screenshot.png)

</div>

## ✨ Features

- 📊 **Portfolio Management** - Track your stocks with real-time updates
- 👀 **Watchlist** - Monitor potential investments
- 🌓 **Dark/Light Mode** - Easy on the eyes, day and night
- 📱 **Fully Responsive** - Perfect on desktop and mobile
- 🔄 **Live Updates** - Stock prices update automatically
- 📈 **Price History** - Visualize stock performance

## 🚀 Quick Start

### Prerequisites

- Node.js 14+
- npm or yarn
- MySQL

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
```

3. Run migrations and start:
```bash
npm run migrate
npm start
```

## 🔌 API Endpoints

### Portfolio
\`\`\`http
GET    /api/stocks           # Get portfolio stocks
POST   /api/stocks           # Add stock
PUT    /api/stocks/:id       # Update stock
DELETE /api/stocks/:id       # Remove stock
\`\`\`

### Watchlist
\`\`\`http
GET    /api/watchlist           # Get watchlist
POST   /api/watchlist           # Add to watchlist
PUT    /api/watchlist/:id       # Update watchlist item
DELETE /api/watchlist/:id       # Remove from watchlist
\`\`\`

## ⚡️ Tech Stack

### Frontend
- React + Vite
- TailwindCSS
- Framer Motion
- Tremor Charts
- Axios

### Backend
- Node.js
- Express
- MySQL
- Knex.js

## ⚠️ Limitations

- Uses simulated stock data
- Single-user environment
- Price updates every minute
- Best viewed in modern browsers

## 📄 License

MIT © [HackStyx](LICENSE)
