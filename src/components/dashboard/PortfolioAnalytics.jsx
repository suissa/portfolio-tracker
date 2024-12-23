import React, { useState } from 'react';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PortfolioAnalytics = ({ stocks, theme }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);

  // Calculate total portfolio value
  const totalValue = stocks.reduce((sum, stock) => sum + (stock.current_price * stock.shares), 0);

  // Custom colors for stocks
  const COLORS = [
    '#3b82f6',  // Blue
    '#8b5cf6',  // Purple
    '#ef4444',  // Red
    '#f59e0b',  // Amber
    '#10b981',  // Emerald
    '#6366f1',  // Indigo
    '#ec4899',  // Pink
    '#14b8a6',  // Teal
    '#f97316',  // Orange
    '#8b5cf6',  // Violet
  ];

  // Prepare data for the pie chart
  const chartData = stocks.map((stock, index) => ({
    name: stock.ticker,
    value: Number(((stock.current_price * stock.shares) / totalValue * 100).toFixed(2)),
    color: COLORS[index % COLORS.length],  // Cycle through colors
    details: {
      shares: stock.shares,
      price: stock.current_price,
      value: stock.current_price * stock.shares,
      buyPrice: stock.buy_price,
      gainLoss: ((stock.current_price - stock.buy_price) / stock.buy_price * 100).toFixed(2)
    }
  })).sort((a, b) => b.value - a.value);

  // Handle stock selection
  const handleStockSelect = (stock) => {
    setSelectedStock(selectedStock?.name === stock.name ? null : stock);
    setActiveIndex(chartData.findIndex(item => item.name === stock.name));
  };

  // Custom active shape for hover effect
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 8}
          outerRadius={innerRadius - 4}
          fill={fill}
        />
        <text
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          fill={theme === 'dark' ? '#fff' : '#000'}
          className="text-lg font-semibold"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          fill={theme === 'dark' ? '#fff' : '#000'}
          className="text-sm"
        >
          {`${value.toFixed(2)}%`}
        </text>
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fill={theme === 'dark' ? '#9ca3af' : '#6b7280'}
          className="text-xs"
        >
          ${payload.details.value.toLocaleString()}
        </text>
        {selectedStock?.name === payload.name && (
          <text
            x={cx}
            y={cy + 40}
            textAnchor="middle"
            fill={Number(payload.details.gainLoss) >= 0 ? '#10b981' : '#ef4444'}
            className="text-xs font-medium"
          >
            {Number(payload.details.gainLoss) >= 0 ? '+' : ''}{payload.details.gainLoss}%
          </text>
        )}
      </g>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    return (
      <div className={`p-3 rounded-lg shadow-lg ${
        theme === 'dark' 
          ? 'bg-gray-800 text-white border border-gray-700'
          : 'bg-white text-gray-900 border border-gray-200'
      }`}>
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm font-medium" style={{ color: data.color }}>
          {data.value.toFixed(2)}% of portfolio
        </p>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          ${data.details.value.toLocaleString()}
        </p>
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {data.details.shares} shares @ ${data.details.price}
        </p>
        <p className={`text-xs mt-1 font-medium ${
          Number(data.details.gainLoss) >= 0 ? 'text-emerald-500' : 'text-red-500'
        }`}>
          {Number(data.details.gainLoss) >= 0 ? '+' : ''}{data.details.gainLoss}% from buy price
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="relative" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              innerRadius={80}
              outerRadius={140}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, index) => !selectedStock && setActiveIndex(index)}
              onClick={(_, index) => handleStockSelect(chartData[index])}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={theme === 'dark' ? '#1f2937' : '#ffffff'}
                  strokeWidth={2}
                  opacity={selectedStock && selectedStock.name !== entry.name ? 0.5 : 1}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col h-[400px]">
        <div className={`${
          theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-white'
        } pb-2`}>
          <h4 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>Holdings Breakdown</h4>
        </div>

        <div className="flex-grow">
          <div className="grid gap-2 mb-4">
            {chartData.map((item, index) => (
              <div 
                key={item.name} 
                onClick={() => handleStockSelect(item)}
                className={`flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800/50 border border-gray-800' 
                    : 'hover:bg-gray-50 border border-gray-100'
                } ${
                  selectedStock?.name === item.name
                    ? theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-gray-50 border-gray-300'
                    : selectedStock
                      ? 'opacity-50'
                      : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ${item.details.value.toLocaleString()}
                  </span>
                  <span className="font-semibold" style={{ color: item.color }}>
                    {item.value}%
                  </span>
                  {selectedStock?.name === item.name && (
                    <span className={`text-sm font-medium ${
                      Number(item.details.gainLoss) >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {Number(item.details.gainLoss) >= 0 ? '+' : ''}{item.details.gainLoss}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h4 className={`text-sm font-medium mb-1.5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Portfolio Diversity</h4>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {stocks.length} Stocks
            </span>
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Total Value: ${totalValue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics; 