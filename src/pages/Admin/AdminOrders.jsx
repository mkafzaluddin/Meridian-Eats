import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const API = import.meta.env.VITE_API_URL;
const STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Dispatched",
  "Delivered",
  "Cancelled",
];

const AdminOrders = () => {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadOrders();
  }, [filter, page]);

  async function loadOrders() {
    setLoading(true);
    const params = new URLSearchParams({ page, pageSize: PAGE_SIZE });
    if (filter) params.append("status", filter);
    const data = await fetch(`${API}/admin/orders?${params}`, {
      headers: authHeader,
    }).then((r) => r.json());
    setOrders(data.orders);
    setTotal(data.total);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await fetch(`${API}/admin/orders/${id}/status`, {
      method: "PUT",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadOrders();
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <div className="admin-filter-row">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" />
            Loading...
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{String(order.id).slice(-4).toUpperCase()}</td>
                  <td>
                    <div>{order.customer}</div>
                    <div className="admin-order-address">
                      {order.city}, {order.state}
                    </div>
                  </td>
                  <td>
                    {order.items.map((item, i) => (
                      <div key={i} className="admin-order-item-row">
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`admin-status-select ${order.status.toLowerCase()}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
