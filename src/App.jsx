import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your styles
import "./index.css"; // Contains your normalize.css
import "./App.css"; // Contains your styles.css

// Import Layout Component
import Layout from "./components/Layout";

// Import Page Components
import Home from "./pages/Home";
import About from "./pages/About";
// FIXED: Import ProjectDetail instead of Project to match your actual filename
import ProjectDetail from "./pages/ProjectDetail";

// Simple 404 Component
const NotFound = () => (
  <div className="box">
    <h1>404</h1>
    <p>Page not found.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />

          {/* FIXED: Use ProjectDetail component here */}
          <Route path="project/:id" element={<ProjectDetail />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
