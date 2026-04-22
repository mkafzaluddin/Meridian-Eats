import React from "react";
import "./Footer.css";
import { assets } from "../assets/assets";

const cities = [
  "Akron",
  "Albuquerque",
  "Bridgeport",
  "Concord",
  "Dayton",
  "El Paso",
  "Hartford",
  "Houston",
  "Indianapolis",
  "McAllen",
  "Mesa",
  "Milwaukee",
  "Nashville",
  "New Orleans",
  "Oklahoma City",
  "Omaha",
  "Orlando",
  "Palm Bay",
  "Providence",
  "Queens",
  "San Antonio",
  "Stony Brook",
  "Tucson",
  "West Hollywood",
];

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        {/* LEFT */}
        <div className="footer-left">
          <h2 className="title">Meridian</h2>

          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>

        {/* CENTER */}
        <div className="footer-center">
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="footer-right">
          <h2>Get in Touch</h2>
          <ul>
            <li>📞 911-9111-9111</li>
            <li>✉️ contact@meridian.com</li>
          </ul>
        </div>
      </div>

      {/* DELIVERY MAP SECTION */}
      <div className="footer-delivery">
        <div className="delivery-left">
          <h3>📍 Cities We Deliver</h3>
          <ul>
            {cities.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>
        </div>

        <div className="delivery-right">
          <div className="usa-map">
            <img src="/usa-map.png" alt="USA Map" />

            {/* PINGS */}
            <span className="ping ca"></span>
            <span className="ping tx"></span>
            <span className="ping fl"></span>
            <span className="ping ny"></span>
            <span className="ping az"></span>
            <span className="ping oh"></span>
          </div>
        </div>
      </div>
      <hr />
      <div className="footer-bottom-wrapper">
        <p className="footer-bottom">
          &copy; {new Date().getFullYear()} Meridian. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
