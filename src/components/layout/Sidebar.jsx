import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  HiHome, 
  HiChartBar, 
  HiStar,
  HiChevronLeft,
  HiChevronRight,
  HiSun,
  HiMoon,
  HiLogout
} from 'react-icons/hi';

const API_BASE_URL = 'http://localhost:5000/api';

// Loading overlay component
const LoadingOverlay = ({ message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  </div>
);

export default function Sidebar({ theme }) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const navItems = [
    { path: '/', icon: HiHome, label: 'Dashboard' },
    { path: '/portfolio', icon: HiChartBar, label: 'Portfolio' },
    { path: '/watchlist', icon: HiStar, label: 'Watchlist' }
  ];

  const randomStocks = [
    { name: 'Apple Inc.', ticker: 'AAPL', buy_price: 175.50, targetPrice: 200.00, current_price: 175.50 },
    { name: 'Microsoft Corporation', ticker: 'MSFT', buy_price: 340.20, targetPrice: 380.00, current_price: 340.20 },
    { name: 'Amazon.com Inc.', ticker: 'AMZN', buy_price: 125.30, targetPrice: 150.00, current_price: 125.30 },
    { name: 'Alphabet Inc.', ticker: 'GOOGL', buy_price: 135.60, targetPrice: 160.00, current_price: 135.60 },
    { name: 'NVIDIA Corporation', ticker: 'NVDA', buy_price: 450.80, targetPrice: 500.00, current_price: 450.80 },
    { name: 'Meta Platforms Inc.', ticker: 'META', buy_price: 290.40, targetPrice: 320.00, current_price: 290.40 },
    { name: 'Tesla Inc.', ticker: 'TSLA', buy_price: 240.50, targetPrice: 280.00, current_price: 240.50 },
    { name: 'Netflix Inc.', ticker: 'NFLX', buy_price: 385.70, targetPrice: 420.00, current_price: 385.70 },
    { name: 'Adobe Inc.', ticker: 'ADBE', buy_price: 420.30, targetPrice: 460.00, current_price: 420.30 },
    { name: 'Salesforce Inc.', ticker: 'CRM', buy_price: 210.90, targetPrice: 240.00, current_price: 210.90 }
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout? This will reset your portfolio..')) {
      try {
        setIsLoading(true);
        setLoadingMessage('Resetting your portfolio...');

        // Get all current stocks
        const portfolioResponse = await axios.get(`${API_BASE_URL}/stocks`);
        const portfolioStocks = portfolioResponse.data || [];
        
        console.log('Current portfolio stocks:', portfolioStocks);
        
        // Delete all current stocks if there are any
        if (portfolioStocks.length > 0) {
          await Promise.all(portfolioStocks.map(stock => 
            axios.delete(`${API_BASE_URL}/stocks/${stock.id}`)
          ));
          console.log('Successfully deleted all portfolio stocks');
        }

        // Shuffle and pick 5 random stocks
        const shuffled = [...randomStocks].sort(() => 0.5 - Math.random());
        const selectedStocks = shuffled.slice(0, 5);
        console.log('Selected stocks to add:', selectedStocks);

        // Keep track of successful and failed additions
        const results = {
          successful: [],
          failed: []
        };

        // Add the random stocks one by one
        for (const stock of selectedStocks) {
          try {
            console.log('Adding stock:', stock);
            
            // Add to portfolio with all required fields
            const portfolioStock = {
              name: stock.name,
              ticker: stock.ticker,
              shares: 1,
              buy_price: parseFloat(stock.buy_price),
              current_price: parseFloat(stock.current_price),
              target_price: parseFloat(stock.targetPrice)
            };
            
            // Add to portfolio
            const response = await axios.post(`${API_BASE_URL}/stocks`, portfolioStock);
            console.log(`Successfully added stock ${stock.ticker}`);
            results.successful.push(stock.ticker);
          } catch (error) {
            console.error(`Error adding stock ${stock.ticker}:`, error);
            results.failed.push(stock.ticker);
            
            // If a stock fails, try to add a different one from our list
            const remainingStocks = randomStocks.filter(s => 
              !selectedStocks.includes(s) && 
              !results.successful.includes(s.ticker) && 
              !results.failed.includes(s.ticker)
            );
            
            if (remainingStocks.length > 0) {
              const replacementStock = remainingStocks[0];
              console.log(`Trying replacement stock: ${replacementStock.ticker}`);
              try {
                const portfolioStock = {
                  name: replacementStock.name,
                  ticker: replacementStock.ticker,
                  shares: 1,
                  buy_price: parseFloat(replacementStock.buy_price),
                  current_price: parseFloat(replacementStock.current_price),
                  target_price: parseFloat(replacementStock.targetPrice)
                };
                
                const response = await axios.post(`${API_BASE_URL}/stocks`, portfolioStock);
                console.log(`Successfully added replacement stock ${replacementStock.ticker}`);
                results.successful.push(replacementStock.ticker);
              } catch (retryError) {
                console.error(`Error adding replacement stock ${replacementStock.ticker}:`, retryError);
                results.failed.push(replacementStock.ticker);
              }
            }
          }
        }

        // Check if we have 5 successful additions
        if (results.successful.length === 5) {
          console.log('Successfully added all 5 stocks:', results.successful);
        } else {
          console.warn(`Only added ${results.successful.length} stocks successfully:`, results.successful);
          console.warn('Failed stocks:', results.failed);
          throw new Error(`Could only add ${results.successful.length} out of 5 stocks`);
        }

        // Small delay before refreshing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Refresh the page
        window.location.reload();
      } catch (error) {
        console.error('Error during logout:', error);
        setLoadingMessage('Error occurred. Please try again.');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        alert(error.message || 'Failed to logout. Please try again.');
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
  };

  return (
    <>
      {isLoading && <LoadingOverlay message={loadingMessage} />}
      <motion.div
        animate={{ width: isExpanded ? "240px" : "80px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`relative min-h-screen border-r ${
          theme === 'dark' 
            ? 'bg-[#171717] border-white/10' 
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute -right-3 top-8 p-1.5 rounded-full ${
            theme === 'dark' 
              ? 'bg-[#171717] text-white border border-white/10' 
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          {isExpanded ? (
            <HiChevronLeft className="w-4 h-4" />
          ) : (
            <HiChevronRight className="w-4 h-4" />
          )}
        </button>

        <div className="flex flex-col h-full p-4">
          {/* Logo Section */}
          <div className="flex items-center h-16 mb-8">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-600'
            }`}>
              <HiChartBar className="h-6 w-6 text-white" />
            </div>
            <motion.div
              animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="ml-3 overflow-hidden"
            >
              {isExpanded && (
                <span className={`text-xl font-bold whitespace-nowrap ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Stock Tracker
                </span>
              )}
            </motion.div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center h-12 px-3 rounded-lg transition-colors ${
                  location.pathname === path
                    ? theme === 'dark'
                      ? 'bg-white/10 text-white'
                      : 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <div className="w-6 flex items-center justify-center">
                  <Icon className={`text-xl ${
                    location.pathname === path && theme !== 'dark'
                      ? 'text-white'
                      : ''
                  }`} />
                </div>
                <motion.span
                  animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="ml-3 whitespace-nowrap overflow-hidden"
                >
                  {isExpanded && label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* Bottom Section with Theme Toggle and Logout */}
          <div className="pt-4 space-y-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center w-full h-12 px-3 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <div className="w-6 flex items-center justify-center">
                {theme === 'dark' ? (
                  <HiSun className="text-xl" />
                ) : (
                  <HiMoon className="text-xl" />
                )}
              </div>
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="ml-3 whitespace-nowrap overflow-hidden"
              >
                {isExpanded && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
              </motion.span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`flex items-center w-full h-12 px-3 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-white/5 hover:text-red-300'
                  : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
              }`}
            >
              <div className="w-6 flex items-center justify-center">
                <HiLogout className="text-xl" />
              </div>
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="ml-3 whitespace-nowrap overflow-hidden"
              >
                {isExpanded && 'Logout'}
              </motion.span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
} 