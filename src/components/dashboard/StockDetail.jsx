import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Title, Text, AreaChart, TabGroup, TabList, Tab, TabPanels, TabPanel, Metric, Flex, Badge } from '@tremor/react';
import { HiTrendingUp, HiTrendingDown, HiClock, HiX, HiCurrencyDollar, HiScale } from 'react-icons/hi';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function StockDetail({ stock, onClose, theme }) {
  const [selectedPeriod, setSelectedPeriod] = useState('1D');
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate metrics
  const totalValue = stock.current_price * stock.shares;
  const gainLoss = ((stock.current_price - stock.buy_price) / stock.buy_price) * 100;
  const valueChange = (stock.current_price - stock.buy_price) * stock.shares;

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        console.log('Fetching historical data for:', stock.ticker, selectedPeriod);
        const response = await axios.get(`${API_BASE_URL}/stocks/${stock.ticker}/historical?period=${selectedPeriod}`);
        console.log('Historical data response:', response.data);
        
        // Transform the data to match the chart requirements
        const formattedData = response.data.map(item => ({
          date: new Date(item.time).toLocaleString(),
          Price: item.price
        }));

        setHistoricalData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        // If there's an error, generate some sample data
        const sampleData = generateSampleData();
        setHistoricalData(sampleData);
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [stock.ticker, selectedPeriod]);

  // Function to generate sample data if API fails
  const generateSampleData = () => {
    const data = [];
    const periods = {
      '1D': 24,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '1Y': 365,
      'ALL': 365
    };
    
    const points = periods[selectedPeriod];
    const now = new Date();
    const basePrice = stock.current_price;
    
    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);
      
      // Add some random variation
      const randomChange = (Math.random() - 0.5) * 2;
      const price = basePrice * (1 + (randomChange / 100));
      
      data.push({
        date: date.toLocaleString(),
        Price: Number(price.toFixed(2))
      });
    }
    
    return data;
  };

  const stats = [
    {
      label: 'Current Price',
      value: `$${stock.current_price.toLocaleString()}`,
      change: gainLoss.toFixed(2) + '%',
      trend: gainLoss >= 0 ? 'up' : 'down',
      icon: HiCurrencyDollar,
      color: gainLoss >= 0 ? 'emerald' : 'red'
    },
    {
      label: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: HiScale,
      color: 'blue'
    },
    {
      label: 'Gain/Loss',
      value: `${gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}%`,
      subValue: `$${valueChange.toLocaleString()}`,
      icon: gainLoss >= 0 ? HiTrendingUp : HiTrendingDown,
      color: gainLoss >= 0 ? 'emerald' : 'red'
    },
    {
      label: 'Last Updated',
      value: new Date(stock.last_updated).toLocaleTimeString(),
      icon: HiClock,
      color: 'amber'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-3xl rounded-3xl ${
          theme === 'dark' 
            ? 'bg-[#1f1f1f] border border-white/10' 
            : 'bg-white border border-gray-200'
        } shadow-2xl overflow-hidden max-h-[85vh]`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{stock.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {stock.ticker}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  gainLoss >= 0
                    ? theme === 'dark'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-green-100 text-green-800'
                    : theme === 'dark'
                      ? 'bg-red-900/30 text-red-400'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(2)}%
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(85vh-5rem)] pb-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} relative overflow-hidden rounded-xl`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 transform translate-x-4 -translate-y-4">
                  <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 bg-${stat.color}-500`}></div>
                </div>
                <div className="relative">
                  <div className="flex items-center gap-1.5">
                    <stat.icon className={`h-4 w-4 text-${stat.color}-500`} />
                    <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </Text>
                  </div>
                  <div className="mt-1.5 flex items-baseline space-x-2">
                    <Metric className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>
                      {stat.value}
                    </Metric>
                    {stat.change && (
                      <Badge
                        color={stat.trend === 'up' ? 'emerald' : 'red'}
                        icon={stat.trend === 'up' ? HiTrendingUp : HiTrendingDown}
                        className="text-xs"
                      >
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  {stat.subValue && (
                    <Text className={`mt-1 text-xs text-${stat.color}-500`}>
                      {stat.subValue}
                    </Text>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Chart */}
          <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} overflow-hidden rounded-xl`}>
            <div className="mb-3">
              <TabGroup>
                <TabList className="mt-1">
                  {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
                    <Tab 
                      key={period} 
                      onClick={() => setSelectedPeriod(period)}
                      className={`${
                        selectedPeriod === period 
                          ? theme === 'dark'
                            ? 'border-b-2 border-blue-500 text-blue-500'
                            : 'border-b-2 border-blue-600 text-blue-600'
                          : ''
                      } transition-colors text-sm px-3 py-2`}
                    >
                      {period}
                    </Tab>
                  ))}
                </TabList>
              </TabGroup>
            </div>

            {loading ? (
              <div className="h-[250px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <AreaChart
                className="h-[250px] mt-3"
                data={historicalData}
                index="date"
                categories={["Price"]}
                colors={[gainLoss >= 0 ? "emerald" : "red"]}
                showLegend={false}
                valueFormatter={(number) => `$${number.toLocaleString()}`}
                yAxisWidth={60}
                showAnimation={true}
                showGridLines={false}
                curveType="natural"
                showXAxis={true}
                showYAxis={true}
                enableLegendSlider={true}
                customTooltip={({ active, payload }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className={`p-2 rounded-lg shadow-lg ${
                      theme === 'dark'
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white border border-gray-200'
                    }`}>
                      <div className="flex flex-col gap-1">
                        <Text className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {data.date}
                        </Text>
                        <Text className="font-medium text-sm">
                          ${data.Price.toLocaleString()}
                        </Text>
                      </div>
                    </div>
                  );
                }}
              />
            )}
          </Card>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} relative overflow-hidden rounded-xl`}>
              <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                <div className={`absolute inset-0 rounded-full blur-3xl opacity-10 ${
                  theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'
                }`}></div>
              </div>
              <div className="relative">
                <Title className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>Position Details</Title>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Shares Owned
                    </Text>
                    <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                      {stock.shares.toLocaleString()}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Average Cost
                    </Text>
                    <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                      ${stock.buy_price.toLocaleString()}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Cost
                    </Text>
                    <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                      ${(stock.buy_price * stock.shares).toLocaleString()}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Market Value
                    </Text>
                    <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                      ${totalValue.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            <Card className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} relative overflow-hidden rounded-xl`}>
              <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                <div className={`absolute inset-0 rounded-full blur-3xl opacity-10 ${
                  gainLoss >= 0
                    ? theme === 'dark' ? 'bg-green-500' : 'bg-green-400'
                    : theme === 'dark' ? 'bg-red-500' : 'bg-red-400'
                }`}></div>
              </div>
              <div className="relative">
                <Title className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>Performance Metrics</Title>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Day Change
                    </Text>
                    <Badge color={gainLoss >= 0 ? 'emerald' : 'red'}>
                      {gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Return
                    </Text>
                    <Text className={`text-sm ${gainLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      ${valueChange.toLocaleString()}
                    </Text>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Portfolio Weight
                    </Text>
                    <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                      {((totalValue / (stock.current_price * stock.shares)) * 100).toFixed(2)}%
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 