import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
import { getImage } from "../../utils/getImage";
import "./PastOrders.css";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SkeletonCards() {
  return (
    <div className="po-skeleton-list">
      {[1, 2, 3].map((i) => (
        <div className="po-skeleton-card" key={i}>
          <div className="po-skeleton-header">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="po-skel" style={{ width: 100, height: 12 }} />
              <div className="po-skel" style={{ width: 160, height: 14 }} />
            </div>
            <div
              className="po-skel"
              style={{ width: 80, height: 24, borderRadius: 100 }}
            />
          </div>
          <div className="po-skeleton-body">
            {[1, 2].map((j) => (
              <div
                key={j}
                style={{ display: "flex", gap: 14, alignItems: "center" }}
              >
                <div
                  className="po-skel"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    className="po-skel"
                    style={{ width: "60%", height: 14 }}
                  />
                  <div
                    className="po-skel"
                    style={{ width: "30%", height: 11 }}
                  />
                </div>
                <div className="po-skel" style={{ width: 50, height: 14 }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, onReorder }) {
  const [expanded, setExpanded] = useState(false);

  const items = order.items ?? [];
  const PREVIEW = 2;
  const hasMore = items.length > PREVIEW;
  const visibleItems = expanded ? items : items.slice(0, PREVIEW);

  // ── map API field names ──
 // ── map API field names ──
const total    = order.totalAmount ?? 0;  // ← use stored total (includes all fees)
const subtotal = items.reduce((s, i) => s + (i.unitPrice ?? 0) * (i.quantity ?? 1), 0);
const tax      = subtotal * 0.1;
const delivery = subtotal * 0.08;


  const status = order.status ?? "Pending";
  const orderId = String(order.id ?? "")
    .slice(-6)
    .toUpperCase();

  return (
    <div className="po-card">
      {/* Header */}
      <div className="po-card-header">
        <div className="po-card-meta">
          <span className="po-order-id">ORDER #{orderId}</span>
          <span className="po-order-date">{formatDate(order.createdAt)}</span>
        </div>
        <div className="po-card-right">
          <span className={`po-status ${status}`}>{status}</span>
        </div>
      </div>

      {/* Body */}
      <div className="po-card-body">
        <div className="po-items">
          {visibleItems.map((item, idx) => {
            const name = item.foodItemName ?? "Item";
            const price = item.unitPrice ?? 0;
            const qty = item.quantity ?? 1;
            const img = getImage(item.imageUrl);

            return (
              <div className="po-item" key={idx}>
                {img ? (
                  <img src={img} alt={name} className="po-item-img" />
                ) : (
                  <div className="po-item-img-placeholder">🍽️</div>
                )}
                <div className="po-item-info">
                  <div className="po-item-name">{name}</div>
                  <div className="po-item-qty">Qty: {qty}</div>
                </div>
                <div className="po-item-price">${(price * qty).toFixed(2)}</div>
              </div>
            );
          })}

          {hasMore && (
            <button
              className="po-show-more"
              onClick={() => setExpanded((p) => !p)}
            >
              {expanded
                ? "▲ Show less"
                : `▼ Show ${items.length - PREVIEW} more item${items.length - PREVIEW > 1 ? "s" : ""}`}
            </button>
          )}
        </div>

        {expanded && (
          <div className="po-breakdown">
            <div className="po-breakdown-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="po-breakdown-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="po-breakdown-row">
              <span>Delivery Fee</span>
              <span>${delivery.toFixed(2)}</span>
            </div>
            <div className="po-breakdown-row bd-total">
              <span>Grand Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <hr className="po-divider" />

        <div className="po-card-footer">
          <div className="po-total-block">
            <span className="po-total-label">Grand Total</span>
            <span className="po-total-amount">${total.toFixed(2)}</span>
          </div>
          <div className="po-actions">
            <Link to={`/track/${order.id}`} className="po-btn po-btn-secondary">
              Track Order
            </Link>
            {(status === "Delivered" || status === "Cancelled") && (
              <button
                className="po-btn po-btn-primary"
                onClick={() => onReorder(items)}
              >
                Reorder
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
const FILTERS = ["All", "Pending", "Confirmed", "Delivered", "Cancelled"];

const PastOrders = () => {
  const { getMyOrders, addToCart, user, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [reorderMsg, setReorderMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getMyOrders()
      .then((data) => {
        setOrders(Array.isArray(data) ? data : (data.orders ?? []));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load orders.");
        setLoading(false);
      });
  }, [token]);

  async function handleReorder(items) {
    for (const item of items) {
      // API order items have foodItemId indirectly — we match by name from foodList
      // Use a simple loop by quantity
      for (let i = 0; i < (item.quantity ?? 1); i++) {
        if (item.foodItemId) await addToCart(item.foodItemId);
      }
    }
    setReorderMsg("Items added to cart! 🛒");
    setTimeout(() => setReorderMsg(""), 3000);
    navigate("/cart");
  }

  const countFor = (f) =>
    f === "All" ? orders.length : orders.filter((o) => o.status === f).length;

  const filtered =
    activeFilter === "All"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  const totalSpent = orders
    .filter((o) => o.status === "Delivered")
    .reduce((s, o) => s + (o.totalAmount ?? 0), 0);

  return (
    <div className="past-orders-page">
      <div className="po-hero">
        <div className="po-hero-text">
          <h1>
            Your <em>Orders</em>
            <br />
            History
          </h1>
          <p>
            {user
              ? `Welcome back, ${user.name?.split(" ")[0]} 👋`
              : "Track and reorder your favourites"}
          </p>
        </div>
        {orders.length > 0 && (
          <div className="po-hero-stats">
            <div className="po-stat">
              <div className="po-stat-num">{orders.length}</div>
              <div className="po-stat-label">Total Orders</div>
            </div>
            <div className="po-stat">
              <div className="po-stat-num">${totalSpent.toFixed(0)}</div>
              <div className="po-stat-label">Total Spent</div>
            </div>
          </div>
        )}
      </div>

      <div className="po-content">
        {reorderMsg && (
          <div
            style={{
              background: "#1db954",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 10,
              marginBottom: 20,
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {reorderMsg}
          </div>
        )}

        {!token && (
          <div className="po-empty po-auth-prompt">
            <span className="po-empty-icon">🔐</span>
            <h3>Please sign in</h3>
            <p>You need to be logged in to view your order history.</p>
            <Link to="/" className="po-btn po-btn-primary">
              Back to Home
            </Link>
          </div>
        )}

        {token && loading && <SkeletonCards />}

        {token && !loading && error && (
          <div className="po-error">
            <span className="po-error-icon">⚠️</span>
            <p>{error}</p>
            <button
              className="po-btn po-btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {token && !loading && !error && (
          <>
            <div className="po-filters">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`po-filter-btn ${activeFilter === f ? "active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f} <span className="po-filter-count">{countFor(f)}</span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="po-empty">
                <span className="po-empty-icon">🍽️</span>
                <h3>
                  No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""}{" "}
                  orders yet
                </h3>
                <p>
                  {activeFilter === "All"
                    ? "Looks like you haven't placed any orders. Let's fix that!"
                    : `You have no ${activeFilter.toLowerCase()} orders.`}
                </p>
                <Link to="/" className="po-btn po-btn-primary">
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="po-list">
                {filtered.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onReorder={handleReorder}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PastOrders;
