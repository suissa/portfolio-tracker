import React from 'react';
import { Text, Badge } from '@tremor/react';
import { HiClock, HiNewspaper, HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

const newsItems = [
  {
    title: 'Tesla Announces New Battery Technology',
    source: 'Bloomberg',
    time: '2 hours ago',
    impact: 'positive',
    symbol: 'TSLA',
    change: '+3.2%',
  },
  {
    title: 'Fed Signals Potential Rate Changes',
    source: 'Reuters',
    time: '4 hours ago',
    impact: 'negative',
    symbol: 'SPY',
    change: '-0.8%',
  },
  {
    title: 'Apple Reveals New Product Line',
    source: 'CNBC',
    time: '6 hours ago',
    impact: 'positive',
    symbol: 'AAPL',
    change: '+2.5%',
  },
  {
    title: 'Semiconductor Shortage Update',
    source: 'WSJ',
    time: '8 hours ago',
    impact: 'neutral',
    symbol: 'NVDA',
    change: '+0.5%',
  },
];

export default function NewsSection() {
  return (
    <div className="space-y-4">
      {newsItems.map((news, index) => (
        <div
          key={index}
          className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge
                  size="sm"
                  className={`
                    ${news.impact === 'positive' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 
                      news.impact === 'negative' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                  `}
                >
                  {news.symbol}
                </Badge>
                <div className="flex items-center space-x-1">
                  {news.impact === 'positive' ? (
                    <HiTrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : news.impact === 'negative' ? (
                    <HiTrendingDown className="h-4 w-4 text-rose-500" />
                  ) : null}
                  <Text className={`text-sm font-medium
                    ${news.impact === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 
                      news.impact === 'negative' ? 'text-rose-600 dark:text-rose-400' :
                      'text-gray-600 dark:text-gray-400'}
                  `}>
                    {news.change}
                  </Text>
                </div>
              </div>
              <Text className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {news.title}
              </Text>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <HiNewspaper className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400">{news.source}</Text>
                </div>
                <div className="flex items-center space-x-1">
                  <HiClock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400">{news.time}</Text>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg className="h-5 w-5 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 