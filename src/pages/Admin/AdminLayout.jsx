import React, { useContext } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./Admin.css";

const AdminLayout = () => {
  const { user, logout } = useContext(StoreContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/admin",            icon: "📊", label: "Dashboard"  },
    { path: "/admin/foods",      icon: "🍔", label: "Foods"      },
    { path: "/admin/categories", icon: "📂", label: "Categories" },
    { path: "/admin/orders",     icon: "📦", label: "Orders"     },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>
            <span className="logo-accent">M</span>eridian
            <span className="logo-accent">E</span>ats
          </h2>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.name}</span>
            <span className="admin-user-role">Administrator</span>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;