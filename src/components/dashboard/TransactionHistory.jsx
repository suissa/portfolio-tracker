import React from 'react';
import { Card, List, ListItem, Text, Badge } from '@tremor/react';

export default function TransactionHistory({ stocks, theme }) {
  // Sort stocks by lastUpdated in descending order
  const sortedStocks = [...stocks].sort((a, b) => 
    new Date(b.lastUpdated) - new Date(a.lastUpdated)
  );

  return (
    <Card className={`${
      theme === 'dark' 
        ? 'bg-transparent border-0' 
        : 'bg-white'
    }`}>
      <List>
        {sortedStocks.map((stock) => {
          const priceChange = stock.current_price - stock.buy_price;
          const priceChangePercent = (priceChange / stock.buy_price) * 100;
          const value = stock.current_price * stock.shares;

          return (
            <ListItem key={stock.id} className={`${
              theme === 'dark' 
                ? 'border-white/10 hover:bg-white/5' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                  <Text className={`font-medium ${
                    theme === 'dark' ? 'text-white' : ''
                  }`}>
                    {stock.name} ({stock.ticker})
                  </Text>
                  <Text className={
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }>
                    {stock.shares.toLocaleString()} shares at ${stock.current_price.toLocaleString()}
                  </Text>
                </div>
                <div className="flex flex-col items-end">
                  <Text className={`font-medium ${
                    theme === 'dark' ? 'text-white' : ''
                  }`}>
                    ${value.toLocaleString()}
                  </Text>
                  <Badge color={priceChangePercent >= 0 ? 'emerald' : 'red'}>
                    {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                  </Badge>
                </div>
              </div>
              <Text className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Last updated: {new Date(stock.lastUpdated).toLocaleString()}
              </Text>
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
} 