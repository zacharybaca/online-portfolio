import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // 1. Wait 2 seconds, then trigger the fade-out animation
    const timer = setTimeout(() => {
      setFade(true);
    }, 2000);

    // 2. Wait for the fade-out (0.5s) to finish, then unmount
    const cleanup = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fade ? 'fade-out' : ''}`}>
      <div className="splash-content">
        {/* You can replace this text with your <img> logo if you prefer */}
        <h1 className="splash-title">Zachary Baca</h1>
        <p className="splash-subtitle">Software Engineer</p>

        {/* Optional Loading Bar */}
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
