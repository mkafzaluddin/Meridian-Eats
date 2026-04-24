import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { useStore } from "../../context/StoreContext";
import { getImage } from "../../utils/getImage";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtotal, tax, deliveryFee, tip, discount, grandTotal, cartData } =
    location.state || {};

  const { cartItems, placeOrder } = useStore();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);
  const [errors, setErrors] = React.useState({}); // ← field errors
  const [form, setForm] = React.useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  if (!cartData || cartData.length === 0)
    return <p className="checkout-empty">Your cart is empty 😢</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for field as user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Validation ────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!form.street.trim()) newErrors.street = "Street address is required.";

    if (!form.city.trim()) newErrors.city = "City is required.";

    if (!form.state.trim()) newErrors.state = "State is required.";

    if (!form.zipCode.trim()) newErrors.zipCode = "Zip code is required.";
    else if (!/^\d{5}(-\d{4})?$/.test(form.zipCode.trim()))
      newErrors.zipCode = "Enter a valid zip code (e.g. 60601).";

    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\+?[\d\s\-().]{7,15}$/.test(form.phone.trim()))
      newErrors.phone = "Enter a valid phone number.";

    return newErrors;
  };

  const handlePlaceOrder = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await placeOrder({
        street: form.street,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        phone: form.phone,
        grandTotal: grandTotal, // ← make sure this is here
      });
      setShowToast(true);
      setTimeout(() => navigate("/"), 4000);
    } catch (err) {
      setError(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      {/* ── Toast Overlay ── */}
      {showToast && (
        <div className="order-toast">
          <div className="order-toast-icon">🎉</div>
          <h2>
            Thank you for ordering on <span className="logo-accent">M</span>
            <span className="logo-dark">eridian</span>
            <span className="logo-accent">E</span>
            <span className="logo-dark">ats</span>
          </h2>
          <p>
            Your order has been received and will be delivered once it's been
            cooked and dispatched.
          </p>
          <div className="order-toast-bar" />
        </div>
      )}

      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-content">
        {/* ---------- Delivery Info ---------- */}
        <div className="checkout-left">
          <h3>Delivery Information</h3>
          <div className="delivery-form">
            <div className="field-group">
              <input
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder="Street Address"
                className={errors.street ? "input-error" : ""}
              />
              {errors.street && (
                <span className="field-error">{errors.street}</span>
              )}
            </div>

            <div className="field-group">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className={errors.city ? "input-error" : ""}
              />
              {errors.city && (
                <span className="field-error">{errors.city}</span>
              )}
            </div>

            <div className="field-group">
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className={errors.state ? "input-error" : ""}
              />
              {errors.state && (
                <span className="field-error">{errors.state}</span>
              )}
            </div>

            <div className="field-group">
              <input
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                placeholder="Zip Code"
                className={errors.zipCode ? "input-error" : ""}
              />
              {errors.zipCode && (
                <span className="field-error">{errors.zipCode}</span>
              )}
            </div>

            <div className="field-group">
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                type="tel"
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && (
                <span className="field-error">{errors.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Order Summary ---------- */}
        <div className="checkout-right">
          <h3>Order Summary</h3>
          <div className="checkout-items">
            {cartData.map((item) => (
              <div className="checkout-item" key={item.id}>
                <img src={getImage(item.imageUrl)} alt={item.name} />
                <div className="checkout-item-info">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-quantity">
                    x {cartItems[item.id]}
                  </span>
                </div>
                <span className="checkout-item-total">
                  ${(item.price * cartItems[item.id]).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal?.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax?.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee (8%)</span>
              <span>${deliveryFee?.toFixed(2)}</span>
            </div>
            {tip > 0 && (
              <div className="summary-row">
                <span>Tip</span>
                <span>${Number(tip).toFixed(2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-${discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row grand-total">
              <span>Grand Total</span>
              <span>${grandTotal?.toFixed(2)}</span>
            </div>
          </div>

          {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}

          <button
            className="checkout-btn"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
