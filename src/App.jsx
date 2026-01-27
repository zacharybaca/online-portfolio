// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import "./index.css";
import "./App.css";

// Component Imports
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import EditProject from './pages/EditProject';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* CRITICAL FIX: Add "/:id" to the end of the path */}
        <Route path="/project/:id" element={<ProjectDetail />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/edit/:id" element={<EditProject />} />
      </Routes>
    </Layout>
  );
}

export default App;
