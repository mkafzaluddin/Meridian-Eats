import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => (
  <div className="header">
    <div className="header-contents">
      <h3>Welcome to Meridian Eats</h3>
      <h2>Order your favorite meals now!</h2>
      <p>
        Explore a wide variety of cuisines and dishes. With just a few clicks,
        have delicious meals delivered right to your doorstep — whether you're
        craving a salad, pasta, or something sweet.
      </p>
      <Link to="/menu">
        <button className="order-now-btn">Order Now</button>
      </Link>
    </div>
  </div>
);

export default Header;