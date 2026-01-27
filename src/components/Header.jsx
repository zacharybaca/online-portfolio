import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="profile-box">
        {/* Update generic image to your actual profile pic if available */}
        <img src="/images/profile.jpg" alt="Zachary Baca" className="profile-img" />
        <h1>Zachary Baca</h1>
        <p>Software Engineer | MERN Stack Developer</p>
        <p className="bio-sub">La Porte, IN</p>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Portfolio</Link>
          </li>
          <li>
            <Link to="/about">About Me</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
