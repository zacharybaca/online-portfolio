import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  // 1. State for Theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 2. Toggle Function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);

    // Toggle the class on the actual HTML Body element
    if (isDarkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  return (
    <div id="my-info" className="sidebar">
      <div className="sidebar-info-box">
        {/* LOGOS */}
        <div className="logo-container">
          <img src="/images/logo-icon.png" alt="ZB Logo" className="logo-image" />
          <img src="/images/logo-text.png" alt="Stack by Zach" className="logo-text" />
        </div>

        {/* 3. NEW TOGGLE BUTTON */}
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

              /* FIX: Change "#fff" to your theme variable */
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
