import React, { useState, useEffect } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('ThemeToggle: Toggling theme to:', newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Dispatch events to notify all components
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
  };

  useEffect(() => {
    // Update document class when theme changes
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        theme === 'dark'
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <HiSun className="w-5 h-5" />
      ) : (
        <HiMoon className="w-5 h-5" />
      )}
    </button>
  );
} 