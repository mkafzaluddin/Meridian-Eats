import React from "react";
import "./AppDownload.css";
import { assets } from "../assets/assets";

const AppDownload = () => {
  return (
    <div>
      <div className="app-download">
        <p className="download-text">
          <b>Download The App For a Better Experience,</b>
        </p>

        {/* Big Logo */}
        <h1 className="app-logo">
          <span className="logo-accent">M</span>
          <span className="logo-dark">eridian</span>
          <span className="logo-accent">E</span>
          <span className="logo-dark">ats</span>
        </h1>

        {/* App store buttons */}
        <div className="app-download-platform">
          <img src={assets.app_store} alt="App Store" />
          <img src={assets.play_store} alt="Google Play" />
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
