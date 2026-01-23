import React, { useState } from 'react';
// REMOVED: import { Outlet } from "react-router-dom";
// We don't need Outlet because you are passing children in App.jsx
import Sidebar from './Sidebar';

// 1. ACCEPT 'children' AS A PROP
const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const appStyle = {
    transform: isSidebarOpen ? 'translateX(300px)' : 'translateX(0px)',
    transition: 'transform 0.4s ease-out',
    minHeight: '100vh',
    width: '100%',
  };

  return (
    <div style={appStyle}>
      <Sidebar />

      <div className="wrapper">
        <div className="header">
          <div className="header-info-box">
            <button
              id="menu-icon"
              className="menu-icon"
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Menu"
            ></button>
            <span>Zachary Baca</span>
          </div>
        </div>

        {/* 2. RENDER THE CHILDREN (This is your Home/Projects content) */}
        <main className="inner-wrapper">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
