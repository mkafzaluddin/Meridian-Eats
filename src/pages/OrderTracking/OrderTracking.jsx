import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./OrderTracking.css";

const API = import.meta.env.VITE_API_URL;

const STEPS = ["Pending", "Confirmed", "Preparing", "Dispatched", "Delivered"];

const STEP_ICONS = {
  Pending: "🕐",
  Confirmed: "✅",
  Preparing: "👨‍🍳",
  Dispatched: "🚴",
  Delivered: "🎉",
};

const STEP_DESC = {
  Pending: "Your order has been received and is waiting to be confirmed.",
  Confirmed: "Your order has been confirmed by the restaurant.",
  Preparing: "The kitchen is preparing your delicious food.",
  Dispatched: "Your order is on the way!",
  Delivered: "Your order has been delivered. Enjoy your meal!",
};

const OrderTracking = () => {
  const { id } = useParams();
  const { token } = useContext(StoreContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchOrder();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id, token]);

  async function fetchOrder() {
    try {
      const res = await fetch(`${API}/orders/${id}/track`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Order not found.");
      const data = await res.json();
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="track-loading">
        <div className="track-spinner" />
        <p>Loading your order...</p>
      </div>
    );

  if (error)
    return (
      <div className="track-error">
        <p>⚠️ {error}</p>
        <Link to="/orders" className="track-back-btn">
          View All Orders
        </Link>
      </div>
    );

  const currentStep = STEPS.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="track-page">
      <div className="track-header">
        <Link to="/orders" className="track-back">
          ← Back to Orders
        </Link>
        <div className="track-order-meta">
          <h1>
            Order <span>#{String(order.id).padStart(4, "0")}</span>
          </h1>
          <p>
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {isCancelled ? (
        <div className="track-cancelled">
          <div className="track-cancelled-icon">❌</div>
          <h2>Order Cancelled</h2>
          <p>This order has been cancelled.</p>
          <Link to="/" className="track-back-btn">
            Order Again
          </Link>
        </div>
      ) : (
        <div className="track-timeline">
          {STEPS.map((step, index) => {
            const isDone = index < currentStep;
            const isCurrent = index === currentStep;
            return (
              <div
                key={step}
                className={`track-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
              >
                <div className="track-step-left">
                  <div className="track-step-icon">
                    {isDone ? "✓" : STEP_ICONS[step]}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`track-step-line ${isDone ? "done" : ""}`}
                    />
                  )}
                </div>
                <div className="track-step-content">
                  <h3>{step}</h3>
                  {isCurrent && <p>{STEP_DESC[step]}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="track-details">
        <div className="track-items">
          <h3>Items Ordered</h3>
          {order.items.map((item, i) => (
            <div className="track-item" key={i}>
              <img
                src={item.imageUrl}
                alt={item.name}
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="track-item-info">
                <span className="track-item-name">{item.name}</span>
                <span className="track-item-qty">x{item.quantity}</span>
              </div>
              <span className="track-item-price">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="track-summary">
          <h3>Delivery Address</h3>
          <p>{order.street}</p>
          <p>
            {order.city}, {order.state} {order.zipCode ?? ""}
          </p>
          <hr />
          <div className="track-total">
            <span>Total Paid</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
