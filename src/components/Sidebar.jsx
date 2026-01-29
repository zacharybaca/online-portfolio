import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  // 1. State for Theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 2. Toggle Function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);

    if (isDarkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  return (
    <div id="my-info" className="sidebar">
      <div className="sidebar-info-box">
        {/* --- FIXED LOGO SECTION --- */}
        <div className="logo-container">
          {/* Use the SINGLE original file. The CSS will handle the transparency. */}
          <img src="/images/logo.png" alt="Stack by Zach" className="logo-image" />
        </div>
        {/* -------------------------- */}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle Dark/Light Mode"
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <div className="thumbnail-box">
          <img className="thumbnail" src="/images/profile.jpg" alt="Zachary Baca" />
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
