import React, { useState, useContext, useRef, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.jsx";

const Navbar = ({ setIsLoginOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems, user, logout } = useContext(StoreContext);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const totalItems = Object.values(cartItems).reduce((sum, c) => sum + c, 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/search", label: "Search" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <div className="navbar">
      {/* ── Logo ── */}
      <Link to="/" className="navbar-logo">
        <h2 className="title">
          <span className="logo-accent">M</span>
          <span className="logo-dark">eridian</span>
          <span className="logo-accent">E</span>
          <span className="logo-dark">ats</span>
        </h2>
      </Link>

      {/* ── Desktop Menu ── */}
      <ul className={`navbar-menu ${mobileMenuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} className="navbar-link">
            <li className={location.pathname === link.to ? "active" : ""}>
              {link.label}
            </li>
          </Link>
        ))}
      </ul>

      {/* ── Right ── */}
      <div className="navbar-right">
        {/* Cart */}
        <div className="basket-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="cart" />
          </Link>
          {totalItems > 0 && <div className="dot">{totalItems}</div>}
        </div>

        {/* Profile or Sign In */}
        {user ? (
          <div className="navbar-profile" ref={dropdownRef}>
            <div
              className="navbar-avatar"
              onClick={() => setDropdownOpen((prev) => !prev)}
              title={user?.name}
            >
              {user?.name
                ? user.name
                    .trim()
                    .split(" ")
                    .map((n) => n[0].toUpperCase())
                    .slice(0, 2)
                    .join("")
                : "?"}
            </div>

            {dropdownOpen && (
              <ul className="navbar-profile-dropdown">
                <div className="dropdown-user-info">
                  <span className="dropdown-user-name">{user?.name}</span>
                  <span className="dropdown-user-email">{user?.email}</span>
                </div>

                {user?.role === "Admin" && (
                  <li onClick={() => setDropdownOpen(false)}>
                    <Link to="/admin">
                      <img src={assets.bag_icon} alt="" /> Admin Panel
                    </Link>
                  </li>
                )}

                <li onClick={() => setDropdownOpen(false)}>
                  <Link to="/orders">
                    <img src={assets.bag_icon} alt="" /> My Orders
                  </Link>
                </li>

                <hr />

                <li
                  className="logout-item"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                >
                  <img src={assets.logout_icon} alt="" /> Logout
                </li>
              </ul>
            )}
          </div>
        ) : (
          <button className="sign-in-btn" onClick={() => setIsLoginOpen(true)}>
            Sign In
          </button>
        )}

        {/* ── Hamburger — mobile only ── */}
        <button
          className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
