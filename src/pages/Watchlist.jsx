import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineTrash, HiSearch, HiPlus, HiTrendingUp, HiTrendingDown, HiOutlineBell, HiOutlineChartBar, HiOutlineClock, HiOutlinePencil } from 'react-icons/hi';
import { Card, Text, Metric, Badge, ProgressBar } from '@tremor/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://portfolio-tracker-backend-y7ne.onrender.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [newStock, setNewStock] = useState({ name: '', ticker: '', target_price: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    console.log('Watchlist component mounted');
    fetchWatchlist();
    syncPortfolioStocks();

    const handleThemeChange = (e) => {
      const newTheme = e.detail || localStorage.getItem('theme') || 'light';
      console.log('Theme changed to:', newTheme);
      setTheme(newTheme);
    };

    // Listen for theme changes
    window.addEventListener('themeChange', handleThemeChange);
    document.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
      document.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  const fetchWatchlist = async () => {
    try {
      console.log('Fetching watchlist from:', API_BASE_URL);
      const response = await api.get('/watchlist');
      console.log('Watchlist response:', response.data);
      setWatchlist(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setError('Failed to fetch watchlist');
      setLoading(false);
    }
  };

  const syncPortfolioStocks = async () => {
    try {
      console.log('Syncing portfolio stocks...');
      await api.post('/watchlist/sync-portfolio');
      await fetchWatchlist();
    } catch (error) {
      console.error('Error syncing portfolio stocks:', error);
      setError('Failed to sync portfolio stocks');
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding stock:', newStock);
      await api.post('/watchlist', newStock);
      setShowAddModal(false);
      setNewStock({ name: '', ticker: '', target_price: '' });
      await fetchWatchlist();
    } catch (error) {
      console.error('Error adding stock:', error);
      setError(error.response?.data?.error || 'Failed to add stock');
    }
  };

  const handleDeleteStock = async (id) => {
    if (window.confirm('Are you sure you want to remove this stock from your watchlist?')) {
      try {
        console.log('Deleting stock:', id);
        await api.delete(`/watchlist/${id}`);
        await fetchWatchlist();
      } catch (error) {
        console.error('Error deleting stock:', error);
        setError('Failed to delete stock');
      }
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating stock:', selectedStock);
      await api.put(`/watchlist/${selectedStock.id}`, {
        target_price: selectedStock.target_price
      });
      setShowUpdateModal(false);
      setSelectedStock(null);
      await fetchWatchlist();
    } catch (error) {
      console.error('Error updating stock:', error);
      setError(error.response?.data?.error || 'Failed to update stock');
    }
  };

  const handleViewStock = async (stock) => {
    setSelectedStock(stock);
    setShowViewModal(true);
    try {
      const response = await api.get(`/watchlist/${stock.id}/history`);
      setPriceHistory(response.data.map(item => ({
        ...item,
        date: new Date(item.timestamp).toLocaleDateString(),
        price: parseFloat(item.price)
      })));
    } catch (error) {
      console.error('Error fetching price history:', error);
      setPriceHistory([]);
    }
  };

  const handleUpdateClick = (stock) => {
    setSelectedStock(stock);
    setShowUpdateModal(true);
  };

  const filteredWatchlist = watchlist.filter(stock => 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateStats = () => {
    const totalStocks = watchlist.length;
    const stocksAboveTarget = watchlist.filter(stock => parseFloat(stock.current_price || 0) > parseFloat(stock.target_price || 0));
    const stocksNearTarget = watchlist.filter(stock => 
      Math.abs((parseFloat(stock.current_price || 0) - parseFloat(stock.target_price || 0)) / parseFloat(stock.target_price || 1)) <= 0.05
    );
    const stocksBelowTarget = watchlist.filter(stock => parseFloat(stock.current_price || 0) < parseFloat(stock.target_price || 0));
    
    const totalValue = watchlist.reduce((sum, stock) => sum + (parseFloat(stock.current_price || 0) * (parseInt(stock.shares || 0, 10) || 1)), 0);
    const targetValue = watchlist.reduce((sum, stock) => sum + (parseFloat(stock.target_price || 0) * (parseInt(stock.shares || 0, 10) || 1)), 0);
    const valueGrowthPotential = totalValue > 0 ? ((targetValue - totalValue) / totalValue) * 100 : 0;

    const bestPerformer = watchlist.reduce((best, stock) => {
      const currentPerformance = ((parseFloat(stock.current_price || 0) - parseFloat(stock.target_price || 0)) / parseFloat(stock.target_price || 1)) * 100;
      if (!best || currentPerformance > best.performance) {
        return { ticker: stock.ticker, performance: currentPerformance };
      }
      return best;
    }, null);

    return {
      totalStocks,
      nearTarget: stocksNearTarget.length,
      aboveTarget: stocksAboveTarget.length,
      belowTarget: stocksBelowTarget.length,
      targetProgress: totalStocks > 0 ? (stocksAboveTarget.length / totalStocks) * 100 : 0,
      valueGrowthPotential,
      bestPerformer,
      totalValue,
      averageProgress: totalStocks > 0 ? watchlist.reduce((sum, stock) => {
        return sum + ((parseFloat(stock.current_price || 0) / parseFloat(stock.target_price || 1)) * 100);
      }, 0) / totalStocks : 0
    };
  };

  const stats = calculateStats();

  console.log('Rendering Watchlist component with theme:', theme);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-[#171717] text-white' : 'bg-gray-50 text-gray-800'}`}
    >
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Watchlist
            </h1>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Track and monitor your favorite stocks
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow sm:max-w-xs">
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <HiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <HiPlus className="w-5 h-5" />
              <span>Add to Watchlist</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Overview Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`p-6 rounded-2xl ${
              theme === 'dark'
                ? 'bg-[#1f1f1f] border border-white/10'
                : 'bg-white border border-gray-200'
            } shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Portfolio Overview
                </Text>
                <Metric className={`mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalStocks} Stocks
                </Metric>
              </div>
              <div className={`p-3 rounded-xl ${
                theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
              }`}>
                <HiOutlineChartBar className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Above Target</Text>
                <Badge color="emerald">{stats.aboveTarget}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Near Target</Text>
                <Badge color="amber">{stats.nearTarget}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Below Target</Text>
                <Badge color="red">{stats.belowTarget}</Badge>
              </div>
            </div>
          </motion.div>

          {/* Target Progress Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`p-6 rounded-2xl ${
              theme === 'dark'
                ? 'bg-[#1f1f1f] border border-white/10'
                : 'bg-white border border-gray-200'
            } shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Target Progress
                </Text>
                <div className="flex items-baseline gap-2 mt-2">
                  <Metric className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    {stats.averageProgress.toFixed(1)}%
                  </Metric>
                  <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    average
                  </Text>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${
                theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'
              }`}>
                <HiOutlineBell className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Overall Progress</Text>
                  <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {stats.targetProgress.toFixed(1)}%
                  </Text>
                </div>
                <ProgressBar value={stats.targetProgress} color="emerald" className="h-2" />
              </div>
              {stats.bestPerformer && (
                <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Best Performer</Text>
                  <div className="flex justify-between items-center mt-1">
                    <Text className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {stats.bestPerformer.ticker}
                    </Text>
                    <Badge color="emerald">
                      {stats.bestPerformer.performance.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Value Analysis Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`p-6 rounded-2xl ${
              theme === 'dark'
                ? 'bg-[#1f1f1f] border border-white/10'
                : 'bg-white border border-gray-200'
            } shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Value Analysis
                </Text>
                <div className="flex items-baseline gap-2 mt-2">
                  <Metric className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    ${stats.totalValue.toLocaleString()}
                  </Metric>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${
                theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
              }`}>
                <HiOutlineClock className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Growth Potential</Text>
                <Badge 
                  color={stats.valueGrowthPotential > 0 ? 'emerald' : 'red'}
                  icon={stats.valueGrowthPotential > 0 ? HiTrendingUp : HiTrendingDown}
                >
                  {stats.valueGrowthPotential.toFixed(1)}%
                </Badge>
              </div>
              <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Last Updated</Text>
                  <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date().toLocaleTimeString()}
                  </Text>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl border ${
              theme === 'dark'
                ? 'bg-red-900/20 border-red-800 text-red-400'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Watchlist Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`rounded-2xl border overflow-hidden ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          } shadow-sm`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-medium tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Stock</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Current Price</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Target Price</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Distance to Target</th>
                  <th className={`px-6 py-4 text-left text-xs font-medium tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredWatchlist.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={`px-6 py-8 text-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className="flex flex-col items-center">
                        <HiOutlineEye className={`w-12 h-12 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className="mt-2">No stocks in watchlist</p>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          Add Your First Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWatchlist.map((stock) => (
                    <tr
                      key={stock.id}
                      className={theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-white'}
                    >
                      <td className={`px-6 py-4 whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium">{stock.name}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{stock.ticker}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        ${parseFloat(stock.current_price || 0).toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        ${parseFloat(stock.target_price || 0).toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap`}>
                        <Badge
                          color={parseFloat(stock.current_price || 0) >= parseFloat(stock.target_price || 0) ? 'emerald' : 'red'}
                          icon={parseFloat(stock.current_price || 0) >= parseFloat(stock.target_price || 0) ? HiTrendingUp : HiTrendingDown}
                        >
                          {(((parseFloat(stock.current_price || 0) - parseFloat(stock.target_price || 0)) / parseFloat(stock.target_price || 1)) * 100).toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleViewStock(stock)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark' 
                                ? 'hover:bg-blue-500/10 text-blue-400 hover:text-blue-300'
                                : 'hover:bg-blue-50 text-blue-500 hover:text-blue-600'
                            }`}
                            title="View Details"
                          >
                            <HiOutlineEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleUpdateClick(stock)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-green-500/10 text-green-400 hover:text-green-300'
                                : 'hover:bg-green-50 text-green-500 hover:text-green-600'
                            }`}
                            title="Update Target"
                          >
                            <HiOutlinePencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStock(stock.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-red-500/10 text-red-400 hover:text-red-300'
                                : 'hover:bg-red-50 text-red-500 hover:text-red-600'
                            }`}
                            title="Remove from Watchlist"
                          >
                            <HiOutlineTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-md p-6 rounded-2xl ${
              theme === 'dark'
                ? 'bg-[#1f1f1f] border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Add Stock to Watchlist
            </h3>
            <form onSubmit={handleAddStock}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={newStock.name}
                    onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                    className={`mt-1 block w-full rounded-xl ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300'
                    } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Ticker Symbol
                  </label>
                  <input
                    type="text"
                    value={newStock.ticker}
                    onChange={(e) => setNewStock({ ...newStock, ticker: e.target.value.toUpperCase() })}
                    className={`mt-1 block w-full rounded-xl ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300'
                    } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Target Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newStock.target_price}
                    onChange={(e) => setNewStock({ ...newStock, target_price: e.target.value })}
                    className={`mt-1 block w-full rounded-xl ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300'
                    } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Stock Modal */}
      {showViewModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-3xl p-6 rounded-2xl ${
              theme === 'dark'
                ? 'bg-[#1f1f1f] border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedStock.name}
                </h3>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedStock.ticker} • Last updated {new Date(selectedStock.last_updated).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedStock(null);
                }}
                className={`p-2 rounded-lg hover:bg-gray-100 ${
                  theme === 'dark' ? 'hover:bg-gray-800' : ''
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Price Chart */}
            <div className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-50'}`}>
              <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Price History
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={priceHistory}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop 
                          offset="5%" 
                          stopColor={theme === 'dark' ? '#60A5FA' : '#3B82F6'} 
                          stopOpacity={0.3}
                        />
                        <stop 
                          offset="95%" 
                          stopColor={theme === 'dark' ? '#60A5FA' : '#3B82F6'} 
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
                    />
                    <XAxis 
                      dataKey="date" 
                      stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                    />
                    <YAxis 
                      stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                      domain={['dataMin', 'dataMax']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                        color: theme === 'dark' ? '#FFFFFF' : '#000000',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={theme === 'dark' ? '#60A5FA' : '#3B82F6'}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Price Information */}
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-50'}`}>
                <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Price Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Current Price</span>
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ${parseFloat(selectedStock.current_price || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Target Price</span>
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ${parseFloat(selectedStock.target_price || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Distance to Target</span>
                    <Badge
                      color={parseFloat(selectedStock.current_price || 0) >= parseFloat(selectedStock.target_price || 0) ? 'emerald' : 'red'}
                      icon={parseFloat(selectedStock.current_price || 0) >= parseFloat(selectedStock.target_price || 0) ? HiTrendingUp : HiTrendingDown}
                    >
                      {(((parseFloat(selectedStock.current_price || 0) - parseFloat(selectedStock.target_price || 0)) / parseFloat(selectedStock.target_price || 1)) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Portfolio Status */}
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-50'}`}>
                <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Portfolio Status
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Shares Held</span>
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {parseInt(selectedStock.shares || 0, 10)}
                    </span>
                  </div>
                  {selectedStock.shares > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Buy Price</span>
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          ${parseFloat(selectedStock.buy_price || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Total Value</span>
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          ${(parseFloat(selectedStock.current_price || 0) * parseInt(selectedStock.shares || 0, 10)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Profit/Loss</span>
                        <Badge
                          color={parseFloat(selectedStock.current_price || 0) >= parseFloat(selectedStock.buy_price || 0) ? 'emerald' : 'red'}
                          icon={parseFloat(selectedStock.current_price || 0) >= parseFloat(selectedStock.buy_price || 0) ? HiTrendingUp : HiTrendingDown}
                        >
                          {(((parseFloat(selectedStock.current_price || 0) - parseFloat(selectedStock.buy_price || 0)) / parseFloat(selectedStock.buy_price || 1)) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedStock(null);
                }}
                className={`px-4 py-2 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleUpdateClick(selectedStock);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Update Target
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Update Stock Modal */}
      {showUpdateModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-md p-6 rounded-2xl ${
              theme === 'dark'
                ? 'bg-[#1f1f1f] border border-white/10'
                : 'bg-white border border-gray-200'
            }`}
          >
            <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Update Target Price
            </h3>
            <form onSubmit={handleUpdateStock}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Stock
                  </label>
                  <p className={`mt-1 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedStock.name} ({selectedStock.ticker})
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    Current Price
                  </label>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ${parseFloat(selectedStock.current_price || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                    New Target Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={selectedStock.target_price}
                    onChange={(e) => setSelectedStock({ ...selectedStock, target_price: e.target.value })}
                    className={`mt-1 block w-full rounded-xl ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-300'
                    } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedStock(null);
                  }}
                  className={`px-4 py-2 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Update Target
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Watchlist; 