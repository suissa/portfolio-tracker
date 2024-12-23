# Stock Portfolio Tracker

A modern web application for tracking your stock portfolio and watchlist. Built with React, Node.js, and PostgreSQL.

## 🌐 Live Demo

- Frontend: [https://portfolio-tracker-hackstyx.vercel.app](https://portfolio-tracker-hackstyx.vercel.app)
- Backend API: [https://portfolio-tracker-backend-y7ne.onrender.com/api](https://portfolio-tracker-backend-y7ne.onrender.com/api)

## ✨ Features

- 📊 Real-time stock portfolio tracking
- 👀 Watchlist management
- 📈 Stock price history visualization
- 🌓 Dark/Light theme support
- 📱 Responsive design
- 🔄 Automatic price updates

## 🚀 Running Locally

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/HackStyx/portfolio-tracker.git
cd portfolio-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL=your_postgresql_connection_string
PORT=5000
NODE_ENV=development
```

4. Run database migrations:
```bash
npm run migrate
# or
yarn migrate
```

5. Start the backend server:
```bash
npm start
# or
yarn start
```

The API will be available at `http://localhost:5000/api`

## 🔧 Environment Variables

### Frontend (.env)
- `VITE_API_BASE_URL`: Backend API URL

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## 📝 API Documentation

### Endpoints

#### Stocks
- `GET /api/stocks` - Get all stocks in portfolio
- `POST /api/stocks` - Add a new stock
- `PUT /api/stocks/:id` - Update a stock
- `DELETE /api/stocks/:id` - Delete a stock
- `GET /api/stocks/:ticker/historical` - Get historical data

#### Watchlist
- `GET /api/watchlist` - Get watchlist
- `POST /api/watchlist` - Add to watchlist
- `PUT /api/watchlist/:id` - Update watchlist item
- `DELETE /api/watchlist/:id` - Remove from watchlist
- `POST /api/watchlist/sync-portfolio` - Sync with portfolio

## ⚠️ Assumptions & Limitations

1. **Stock Data**
   - Uses simulated stock data for demonstration
   - Real-time price updates are simulated
   - Historical data is generated for demonstration

2. **Authentication**
   - Currently uses a simple reset-based logout
   - No user authentication system
   - Single user environment

3. **Performance**
   - Limited to managing reasonable portfolio sizes
   - Price updates every minute
   - Historical data limited to recent periods

4. **Browser Support**
   - Requires modern browsers
   - Best experienced on Chrome, Firefox, Safari
   - Requires JavaScript enabled

## 🛠️ Tech Stack

- **Frontend**
  - React
  - Vite
  - TailwindCSS
  - Framer Motion
  - Tremor
  - Axios

- **Backend**
  - Node.js
  - Express
  - PostgreSQL
  - Knex.js
  - Node-Postgres

## 📱 Responsive Design

- Fully responsive layout
- Mobile-first approach
- Adaptive UI components
- Touch-friendly interactions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
