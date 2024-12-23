import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const handleThemeChange = (e) => {
      const newTheme = e.detail.theme || e.detail || localStorage.getItem('theme') || 'light';
      console.log('App: Theme change detected:', newTheme);
      setTheme(newTheme);
      
      // Dispatch a global event for all components
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
    };

    // Listen to both custom events and storage changes
    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('storage', () => {
      const storedTheme = localStorage.getItem('theme') || 'light';
      handleThemeChange({ detail: { theme: storedTheme } });
    });
    document.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
      document.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    // Update document class when theme changes
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Router>
      <div className={`flex h-screen ${theme === 'dark' ? 'bg-[#171717]' : 'bg-white'}`}>
        <Sidebar theme={theme} />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard theme={theme} />} />
            <Route path="/portfolio" element={<Portfolio theme={theme} />} />
            <Route path="/watchlist" element={<Watchlist theme={theme} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
