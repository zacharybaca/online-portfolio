import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'

const Sidebar = () => {
  // 1. State for Theme
  const { isDarkMode, setIsDarkMode } = useTheme();

  // 2. THE FIX: Use useEffect to sync State, LocalStorage, and CSS
  useEffect(() => {
    // Save to storage (converts boolean to string automatically)
    localStorage.setItem('theme', isDarkMode);

    // Apply CSS classes based on the state
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]); // This runs every time isDarkMode changes

  // 3. Toggle Function (Now much simpler)
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div id="my-info" className="sidebar">
      <div className="sidebar-info-box">
        {/* --- FIXED LOGO SECTION --- */}
        <div className="logo-container">
          <img src="/images/logo.png" alt="Stack by Zach" className="logo-image" />
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle Dark/Light Mode"
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        {/* View Blog Section */}
        <Link to="/blogs">
          <Button className="theme-toggle-btn" variant="primary" size="lg" active>
            📰 Read My Blogs
          </Button>
        </Link>

        <div className="thumbnail-box">
          <img className="thumbnail" src="/images/profile-pic.jpg" alt="Zachary Baca" />
        </div>

        <div className="dev-intro-box">
          <h5 id="name-heading">Zachary Baca</h5>

          <p>
            Hello! I’m Zachary, a passionate Full-Stack Web Developer who thrives on turning ideas
            into responsive, user-friendly web applications.
          </p>
          <p>
            Coding isn’t just what I do—it’s what I love. I’m constantly exploring new tools,
            refining my skills, and building projects that solve real problems.
          </p>

          <div className="thumbnail-box">
            <Link to="/about">
              <img className="qr-image" src="/images/resume-qr-code.png" alt="Link to About Page" />
            </Link>
          </div>

          <Link
            to="/about"
            className="qr-image"
            style={{
              display: 'block',
              marginTop: '15px',
              height: 'auto',
              width: 'auto',
              color: 'var(--text-primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Learn More &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
