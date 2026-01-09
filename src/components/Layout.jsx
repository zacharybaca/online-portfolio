import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Replicating the script logic:
  // Instead of document.body, we transform the main app wrapper.
  const appStyle = {
    transform: isSidebarOpen ? "translateX(300px)" : "translateX(0px)",
    transition: "transform 0.4s ease-out", // Matching your CSS transition
    minHeight: "100vh", // Ensures the background covers the full height
    width: "100%",
  };

  return (
    // We apply the animation style to this outer div
    <div style={appStyle}>
      {/* Sidebar sits at left: -300px (defined in your CSS) */}
      <Sidebar />

      <div className="wrapper">
        <div className="header">
          <div className="header-info-box">
            <button
              id="menu-icon"
              className="menu-icon"
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggles state
              aria-label="Toggle Menu"
            ></button>
            <span>Zachary Baca</span>
          </div>
        </div>

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
