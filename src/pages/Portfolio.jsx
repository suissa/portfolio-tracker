import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Card,
  Title,
  Text,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Button
} from '@tremor/react';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash,
  HiTrendingUp,
  HiTrendingDown,
  HiX,
  HiCurrencyDollar,
  HiCollection,
  HiChartBar
} from 'react-icons/hi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://portfolio-tracker-backend-y7ne.onrender.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export default function Portfolio() {
  const [stocks, setStocks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [newStock, setNewStock] = useState({
    name: '',
    ticker: '',
    shares: 1,
    buy_price: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('theme') || 'light');
    };

    window.addEventListener('storage', handleThemeChange);
    document.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      document.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      console.log('Fetching stocks from:', API_BASE_URL);
      const response = await api.get('/stocks');
      console.log('Stocks fetched successfully:', response.data);
      setStocks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError('Failed to fetch stocks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/stocks', {
        name: newStock.name,
        ticker: newStock.ticker,
        shares: parseFloat(newStock.shares),
        buy_price: parseFloat(newStock.buy_price)
      });
      
      setStocks([response.data, ...stocks]);
      setShowAddModal(false);
      setNewStock({ name: '', ticker: '', shares: 1, buy_price: '' });
      setError(null);
    } catch (err) {
      console.error('Error adding stock:', err);
      setError(err.response?.data?.error || 'Failed to add stock. Please try again.');
    }
  };

  const handleEditStock = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/stocks/${editingStock.id}`, {
        name: editingStock.name,
        ticker: editingStock.ticker,
        shares: parseFloat(editingStock.shares),
        buy_price: parseFloat(editingStock.buy_price)
      });
      
      setStocks(stocks.map(stock => 
        stock.id === editingStock.id ? response.data : stock
      ));
      setShowEditModal(false);
      setEditingStock(null);
      setError(null);
    } catch (err) {
      console.error('Error updating stock:', err);
      setError(err.response?.data?.error || 'Failed to update stock. Please try again.');
    }
  };

  const handleDeleteStock = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock?')) {
      try {
        await api.delete(`/stocks/${id}`);
        setStocks(stocks.filter(stock => stock.id !== id));
        setError(null);
      } catch (err) {
        console.error('Error deleting stock:', err);
        setError('Failed to delete stock. Please try again.');
      }
    }
  };

  const getTotalValue = () => {
    return stocks.reduce((total, stock) => total + (stock.current_price * stock.shares), 0);
  };

  const getTotalGainLoss = () => {
    const totalGainLoss = stocks.reduce((total, stock) => {
      const gainLoss = ((stock.current_price - stock.buy_price) / stock.buy_price) * 100;
      return total + gainLoss;
    }, 0);
    return stocks.length > 0 ? totalGainLoss / stocks.length : 0;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title className="text-2xl font-bold">Portfolio</Title>
          <Text className="text-gray-500 dark:text-gray-400">Manage your stock investments</Text>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className={`px-6 py-2.5 flex items-center gap-2 rounded-xl font-semibold transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30'
          } hover:-translate-y-0.5`}
        >
          <HiPlus className="w-5 h-5" />
          Add Stock
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl hover:-translate-y-1 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50' 
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'
            }`}
            decoration="none"
          >
            <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
              <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full blur-2xl"></div>
            </div>
            <div className="relative flex items-center space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg ${
                theme === 'dark' ? 'shadow-blue-500/20' : 'shadow-blue-500/30'
              }`}>
                <HiCollection className="h-6 w-6 text-white" />
              </div>
              <div>
                <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Total Holdings</Text>
                <Title className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{stocks.length} Stocks</Title>
              </div>
            </div>
          </Card>
      </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl hover:-translate-y-1 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50' 
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'
            }`}
            decoration="none"
          >
            <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
              <div className="absolute inset-0 bg-emerald-500 opacity-20 rounded-full blur-2xl"></div>
            </div>
            <div className="relative flex items-center space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg ${
                theme === 'dark' ? 'shadow-emerald-500/20' : 'shadow-emerald-500/30'
              }`}>
                <HiCurrencyDollar className="h-6 w-6 text-white" />
              </div>
                            <div>
                <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Portfolio Value</Text>
                <Title className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>${getTotalValue().toLocaleString()}</Title>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl hover:-translate-y-1 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50' 
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/50'
            }`}
            decoration="none"
          >
            <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
              <div className={`absolute inset-0 ${
                getTotalGainLoss() >= 0 ? 'bg-emerald-500' : 'bg-red-500'
              } opacity-20 rounded-full blur-2xl`}></div>
            </div>
            <div className="relative flex items-center space-x-4">
              <div className={`p-3 rounded-xl shadow-lg ${
                getTotalGainLoss() >= 0 
                  ? `bg-gradient-to-br from-emerald-500 to-emerald-600 ${
                      theme === 'dark' ? 'shadow-emerald-500/20' : 'shadow-emerald-500/30'
                    }`
                  : `bg-gradient-to-br from-red-500 to-red-600 ${
                      theme === 'dark' ? 'shadow-red-500/20' : 'shadow-red-500/30'
                    }`
              }`}>
                <HiChartBar className="h-6 w-6 text-white" />
                            </div>
              <div>
                <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Average Return</Text>
                <div className="flex items-center mt-1">
                  {getTotalGainLoss() >= 0 ? (
                    <HiTrendingUp className="h-5 w-5 text-emerald-500 mr-1" />
                  ) : (
                    <HiTrendingDown className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  <Title className={`text-2xl font-bold ${
                    getTotalGainLoss() >= 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {getTotalGainLoss().toFixed(2)}%
                  </Title>
                </div>
                            </div>
                </div>
              </Card>
        </motion.div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Stocks Table */}
      <div className={`rounded-xl overflow-hidden border ${
        theme === 'dark' 
          ? 'bg-[#171717] border-gray-700/50' 
          : 'bg-white border-gray-200/70'
      } shadow-xl`}>
        <div className="overflow-x-auto">
          <table className={`w-full border-collapse ${
            theme === 'dark' ? 'bg-[#171717]' : 'bg-white'
          }`}>
            <thead>
              <tr className={`border-b ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700/50' 
                  : 'bg-gray-50 border-gray-200/70'
              }`}>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                }`}>Stock</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                }`}>Current Price</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                }`}>Holdings</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                }`}>Total Value</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                }`}>Return</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
              {stocks.map((stock) => {
                const value = stock.current_price * stock.shares;
                const gainLoss = ((stock.current_price - stock.buy_price) / stock.buy_price) * 100;
                const valueChange = (stock.current_price - stock.buy_price) * stock.shares;
                
                return (
                  <tr 
                    key={stock.id}
                    className={`transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-800/50 bg-[#171717]' 
                        : 'hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>{stock.name}</span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>{stock.ticker}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      ${stock.current_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>{stock.shares.toLocaleString()} shares</span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>@ ${stock.buy_price.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      ${value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                          gainLoss >= 0
                            ? theme === 'dark'
                              ? 'bg-emerald-900/30 text-emerald-400'
                              : 'bg-emerald-100 text-emerald-800'
                            : theme === 'dark'
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          <span className="mr-1">
                            {gainLoss >= 0 ? (
                              <HiTrendingUp className="w-4 h-4" />
                            ) : (
                              <HiTrendingDown className="w-4 h-4" />
                            )}
                          </span>
                          {gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(2)}%
                        </div>
                        <span className={`text-sm ${
                          gainLoss >= 0
                            ? theme === 'dark'
                              ? 'text-emerald-400'
                              : 'text-emerald-600'
                            : theme === 'dark'
                              ? 'text-red-400'
                              : 'text-red-600'
                        }`}>
                          {valueChange >= 0 ? '+' : ''}${valueChange.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingStock({
                              ...stock,
                              shares: stock.shares,
                            });
                            setShowEditModal(true);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <HiPencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStock(stock.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300'
                              : 'bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700'
                          }`}
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <Title>Add New Stock</Title>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newStock.name}
                  onChange={(e) => setNewStock({...newStock, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ticker Symbol
                </label>
                <input
                  type="text"
                  value={newStock.ticker}
                  onChange={(e) => setNewStock({...newStock, ticker: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  required
                />
                  </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Shares
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={newStock.shares}
                  onChange={(e) => setNewStock({...newStock, shares: Math.max(1, parseInt(e.target.value) || 0)})}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  required
                />
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Buy Price
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={newStock.buy_price}
                  onChange={(e) => setNewStock({...newStock, buy_price: Math.max(0.01, parseFloat(e.target.value) || 0)})}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="secondary"
                  color="gray"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="blue"
                >
                  Add Stock
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {showEditModal && editingStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <Title>Edit Stock</Title>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingStock(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <HiX className="h-6 w-6" />
              </button>
                  </div>
            <form onSubmit={handleEditStock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editingStock.name}
                  onChange={(e) => setEditingStock({...editingStock, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  required
                />
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ticker Symbol
                </label>
                <input
                  type="text"
                  value={editingStock.ticker}
                  onChange={(e) => setEditingStock({...editingStock, ticker: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  required
                />
                        </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Shares
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={editingStock.shares}
                  onChange={(e) => setEditingStock({...editingStock, shares: Math.max(1, parseInt(e.target.value) || 0)})}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  required
                />
                      </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Buy Price
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={editingStock.buy_price}
                  onChange={(e) => setEditingStock({...editingStock, buy_price: Math.max(0.01, parseFloat(e.target.value) || 0)})}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  required
                />
                  </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="secondary"
                  color="gray"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingStock(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="blue"
                >
                  Save Changes
                </Button>
                </div>
            </form>
      </motion.div>
        </div>
      )}
    </motion.div>
  );
} 