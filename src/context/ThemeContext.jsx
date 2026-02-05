// src/context/ThemeContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize state based on localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Check specifically if the string is 'true'.
    // If savedTheme is null (first visit), default to true.
    return savedTheme !== null ? savedTheme === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode);
    // Apply the class to body
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
