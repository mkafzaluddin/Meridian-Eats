import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const API = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const { token } = useContext(StoreContext);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    fetch(`${API}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => { setError("Failed to load dashboard."); setLoading(false); });
  }, []);

  if (loading) return <div className="admin-loading"><div className="admin-spinner" />Loading...</div>;
  if (error)   return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Dashboard</h1>

      {/* Stats cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📦</div>
          <div className="admin-stat-info">
            <div className="admin-stat-num">{stats.totalOrders}</div>
            <div className="admin-stat-label">Total Orders</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👥</div>
          <div className="admin-stat-info">
            <div className="admin-stat-num">{stats.totalCustomers}</div>
            <div className="admin-stat-label">Customers</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">💰</div>
          <div className="admin-stat-info">
            <div className="admin-stat-num">${stats.totalRevenue.toFixed(2)}</div>
            <div className="admin-stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="admin-stat-card pending">
          <div className="admin-stat-icon">⏳</div>
          <div className="admin-stat-info">
            <div className="admin-stat-num">{stats.pendingOrders}</div>
            <div className="admin-stat-label">Pending Orders</div>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        {/* Top Items */}
        <div className="admin-card">
          <h3 className="admin-card-title">🔥 Top Selling Items</h3>
          <div className="admin-top-items">
            {stats.topItems.map((item, i) => (
              <div className="admin-top-item" key={i}>
                <span className="admin-top-rank">#{i + 1}</span>
                <img src={item.imageUrl} alt={item.name}
                  onError={e => e.target.style.display = "none"} />
                <div className="admin-top-item-info">
                  <span className="admin-top-item-name">{item.name}</span>
                  <span className="admin-top-item-sold">{item.totalSold} sold</span>
                </div>
                <span className="admin-top-item-rev">${item.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card">
          <h3 className="admin-card-title">🕐 Recent Orders</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order.id}>
                  <td>#{String(order.id).slice(-4).toUpperCase()}</td>
                  <td>{order.customerName}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`admin-status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;