// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import './index.css';
import './App.css';

// Component Imports
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen'; // New Import
import Home from './pages/Home';
import About from './pages/About';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import EditProject from './pages/EditProject';
import BlogFeed from './components/BlogFeed';

function App() {
  // State to track if the splash screen is visible
  const [showSplash, setShowSplash] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);

  return (
    <>
      {/* 1. Show Splash Screen if state is true */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* 2. Main App Content */}
      {/* We keep the app mounted but hidden so it loads data while the splash is playing.
          Once showSplash is false, 'display' switches to 'block' and the app appears instantly. */}
      <div style={{ display: showSplash ? 'none' : 'block' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blogs" element={<BlogFeed blogPosts={blogPosts} setBlogPosts={setBlogPosts}/>} />

            {/* Dynamic Project Route */}
            <Route path="/project/:id" element={<ProjectDetail />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Admin blogPosts={blogPosts}/>} />
            <Route path="/edit/:id" element={<EditProject />} />
          </Routes>
        </Layout>
      </div>
    </>
  );
}

export default App;
