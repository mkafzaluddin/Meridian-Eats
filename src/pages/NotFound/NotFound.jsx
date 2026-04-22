import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-emoji">🍽️</div>
        <h1>404</h1>
        <h2>Oops! Page not found</h2>
        <p>
          Looks like this page got eaten. Let's get you back to the good stuff.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="notfound-btn-primary">
            Back to Home
          </Link>
          <Link to="/menu" className="notfound-btn-secondary">
            Browse Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
