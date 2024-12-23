import React from 'react';
import { Card, Title, Text, Metric, BarList, DonutChart } from '@tremor/react';
import { HiMail, HiPhone, HiLocationMarker, HiCalendar, HiTrendingUp, HiChartBar, HiCurrencyDollar, HiScale } from 'react-icons/hi';
import { motion } from 'framer-motion';

const userStats = [
  { name: 'Total Trades', value: '156', icon: HiChartBar, color: 'indigo' },
  { name: 'Win Rate', value: '68%', icon: HiTrendingUp, color: 'emerald' },
  { name: 'Avg. Return', value: '12.4%', icon: HiScale, color: 'violet' },
  { name: 'Portfolio Size', value: '$50,000', icon: HiCurrencyDollar, color: 'blue' },
];

const portfolioDistribution = [
  { name: 'Technology', value: 45 },
  { name: 'Healthcare', value: 25 },
  { name: 'Finance', value: 15 },
  { name: 'Consumer', value: 15 },
];

const tradingActivity = [
  { name: 'Day Trading', value: 45, icon: '📈' },
  { name: 'Swing Trading', value: 30, icon: '📊' },
  { name: 'Long Term', value: 15, icon: '🎯' },
  { name: 'Options', value: 10, icon: '⚡' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Profile() {
  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Profile Header */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-neutral-900 dark:to-indigo-900/20 border border-indigo-100/50 dark:border-indigo-900/50">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <motion.div 
              className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-4xl text-white font-bold">JP</span>
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <Title className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">John Doe</Title>
              <Text className="text-gray-600 dark:text-gray-400 text-lg">Professional Trader</Text>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 shadow-sm">
                  <HiMail className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <Text className="text-gray-700 dark:text-gray-300">john.doe@example.com</Text>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 shadow-sm">
                  <HiPhone className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <Text className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</Text>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 shadow-sm">
                  <HiLocationMarker className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <Text className="text-gray-700 dark:text-gray-300">New York, USA</Text>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 shadow-sm">
                  <HiCalendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <Text className="text-gray-700 dark:text-gray-300">Member since 2021</Text>
                </motion.div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Trading Statistics */}
      <motion.div 
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {userStats.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className="transform transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div>
                  <Text className="text-gray-600 dark:text-gray-400">{stat.name}</Text>
                  <Metric className="text-2xl text-gray-900 dark:text-gray-100">{stat.value}</Metric>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Portfolio Distribution and Trading Activity */}
      <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-900/20">
            <Title className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-6">
              Portfolio Distribution
            </Title>
            <DonutChart
              data={portfolioDistribution}
              category="value"
              index="name"
              valueFormatter={(number) => `${number}%`}
              colors={["indigo", "violet", "purple", "fuchsia"]}
              showAnimation={true}
              className="mt-6 h-60"
            />
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-neutral-900 dark:to-blue-900/20">
            <Title className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text mb-6">
              Trading Activity
            </Title>
            <div className="space-y-4">
              {tradingActivity.map((activity) => (
                <motion.div
                  key={activity.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <Text className="font-medium text-gray-700 dark:text-gray-300">{activity.name}</Text>
                  </div>
                  <Text className="font-semibold text-gray-900 dark:text-gray-100">{activity.value}%</Text>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 