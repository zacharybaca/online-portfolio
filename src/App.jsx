// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import './index.css';
import './App.css';

// Component Imports
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import About from './pages/About';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import EditProject from './pages/EditProject';
import BlogFeed from './components/BlogFeed';

function App() {
  // State to track if the splash screen is visible
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <div style={{ display: showSplash ? 'none' : 'block' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* CLEANED UP: No longer passing props */}
            <Route path="/blogs" element={<BlogFeed />} />

            <Route path="/project/:id" element={<ProjectDetail />} />

            {/* CLEANED UP: No longer passing props */}
            <Route path="/admin" element={<Admin />} />

            <Route path="/edit/:id" element={<EditProject />} />
          </Routes>
        </Layout>
      </div>
    </>
  );
}

export default App;
