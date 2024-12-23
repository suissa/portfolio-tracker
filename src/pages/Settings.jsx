import React, { useState } from 'react';
import { Card, Title, Text, TextInput, Select, SelectItem, Switch } from '@tremor/react';
import { HiBell, HiGlobe, HiLockClosed, HiColorSwatch, HiMail, HiDeviceMobile, HiNewspaper, HiCurrencyDollar } from 'react-icons/hi';
import { motion } from 'framer-motion';

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

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    trading: false,
    news: true,
  });

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
  const timeZones = ['UTC-8', 'UTC-5', 'UTC+0', 'UTC+1', 'UTC+8'];
  const themes = ['System', 'Light', 'Dark'];

  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Notification Settings */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-neutral-900 dark:to-indigo-900/20 border border-indigo-100/50 dark:border-indigo-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <HiBell className="w-6 h-6 text-white" />
            </div>
            <Title className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
              Notification Preferences
            </Title>
          </div>
          <div className="mt-6 space-y-4">
            <motion.div 
              className="p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <HiMail className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <div>
                    <Text className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Receive daily portfolio updates</Text>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onChange={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                  className="bg-gray-200 dark:bg-gray-700"
                />
              </div>
            </motion.div>
            <motion.div 
              className="p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <HiDeviceMobile className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <div>
                    <Text className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Get real-time alerts</Text>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onChange={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                />
              </div>
            </motion.div>
            <motion.div 
              className="p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <HiCurrencyDollar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <div>
                    <Text className="font-medium text-gray-900 dark:text-gray-100">Trading Notifications</Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Updates about your trades</Text>
                  </div>
                </div>
                <Switch
                  checked={notifications.trading}
                  onChange={() => setNotifications(prev => ({ ...prev, trading: !prev.trading }))}
                />
              </div>
            </motion.div>
            <motion.div 
              className="p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <HiNewspaper className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <div>
                    <Text className="font-medium text-gray-900 dark:text-gray-100">News Alerts</Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Market news and updates</Text>
                  </div>
                </div>
                <Switch
                  checked={notifications.news}
                  onChange={() => setNotifications(prev => ({ ...prev, news: !prev.news }))}
                />
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Regional Settings */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-neutral-900 dark:to-blue-900/20 border border-blue-100/50 dark:border-blue-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <HiGlobe className="w-6 h-6 text-white" />
            </div>
            <Title className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
              Regional Settings
            </Title>
          </div>
          <div className="mt-6 space-y-6">
            <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5">
              <Text className="font-medium text-gray-900 dark:text-gray-100 mb-2">Default Currency</Text>
              <Select defaultValue="USD" className="bg-white dark:bg-gray-800">
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5">
              <Text className="font-medium text-gray-900 dark:text-gray-100 mb-2">Time Zone</Text>
              <Select defaultValue="UTC+0" className="bg-white dark:bg-gray-800">
                {timeZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-900/20 border border-purple-100/50 dark:border-purple-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <HiColorSwatch className="w-6 h-6 text-white" />
            </div>
            <Title className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Appearance
            </Title>
          </div>
          <div className="mt-6">
            <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5">
              <Text className="font-medium text-gray-900 dark:text-gray-100 mb-2">Theme</Text>
              <Select defaultValue="System" className="bg-white dark:bg-gray-800">
                {themes.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-white to-rose-50/30 dark:from-neutral-900 dark:to-rose-900/20 border border-rose-100/50 dark:border-rose-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl shadow-lg">
              <HiLockClosed className="w-6 h-6 text-white" />
            </div>
            <Title className="text-xl font-bold bg-gradient-to-r from-rose-500 to-red-500 text-transparent bg-clip-text">
              Security
            </Title>
          </div>
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5">
              <Text className="font-medium text-gray-900 dark:text-gray-100 mb-2">Current Password</Text>
              <TextInput type="password" placeholder="Enter current password" className="bg-white dark:bg-gray-800" />
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5">
              <Text className="font-medium text-gray-900 dark:text-gray-100 mb-2">New Password</Text>
              <TextInput type="password" placeholder="Enter new password" className="bg-white dark:bg-gray-800" />
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5">
              <Text className="font-medium text-gray-900 dark:text-gray-100 mb-2">Confirm New Password</Text>
              <TextInput type="password" placeholder="Confirm new password" className="bg-white dark:bg-gray-800" />
            </div>
            <motion.button 
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-medium hover:from-rose-600 hover:to-red-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Update Password
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
} 