import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { getImage } from "../../utils/getImage";
import { Link } from "react-router-dom";

function Cart({ setIsLoginOpen }) {
  const { foodList, cartItems, addToCart, removeFromCart, user } =
    useContext(StoreContext);
  const [tip, setTip] = useState(3.0);
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const navigate = useNavigate();

  const VALID_COUPONS = { FOOD10: 0.1, FOOD50: 0.5, FOOD75: 0.75 };

  const cartData = foodList.filter((item) => cartItems[item.id] > 0);
  const subtotal = cartData.reduce(
    (sum, item) => sum + item.price * cartItems[item.id],
    0,
  );
  const tax = subtotal * 0.1;
  const deliveryFee = subtotal * 0.08;
  const discountRate = VALID_COUPONS[coupon.toUpperCase()] || 0;
  const discount = subtotal * discountRate;
  const grandTotal = subtotal + tax + deliveryFee + Number(tip) - discount;

  const handleCoupon = (val) => {
    setCoupon(val);
    setCouponError("");
    if (val && !VALID_COUPONS[val.toUpperCase()])
      setCouponError("Invalid coupon code.");
  };

  if (cartData.length === 0)
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/menu" className="cart-empty-btn">
          Browse Menu
        </Link>
      </div>
    );

  const handleCheckout = () => {
    if (!user) {
      setIsLoginOpen(true); // ← opens login modal instead of alert
      return;
    }
    navigate("/order", {
      state: {
        subtotal,
        tax,
        deliveryFee,
        tip,
        discount,
        grandTotal,
        cartData,
      },
    });
  };

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <h2 className="cart-title">Your Cart</h2>
        {cartData.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-left">
              <img src={getImage(item.imageUrl)} alt={item.name} />
              <span className="cart-item-name">{item.name}</span>
            </div>
            <p className="cart-item-price">${item.price.toFixed(2)}</p>
            <div className="cart-item-quantity">
              <button onClick={() => removeFromCart(item.id)}>-</button>
              <span>{cartItems[item.id]}</span>
              <button onClick={() => addToCart(item.id)}>+</button>
            </div>
            <p className="cart-item-total">
              ${(item.price * cartItems[item.id]).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="cart-item-remove"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary-section">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee (8%)</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tip</span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={tip}
            onChange={(e) => setTip(Math.max(0, Number(e.target.value)))}
          />
        </div>
        <div className="summary-row coupon-row">
          <span>Coupon</span>
          <div>
            <input
              type="text"
              value={coupon}
              placeholder="Enter code"
              onChange={(e) => handleCoupon(e.target.value)}
            />
            {couponError && <span className="coupon-error">{couponError}</span>}
            {discount > 0 && (
              <span className="coupon-success">
                ✓ {coupon.toUpperCase()} applied!
              </span>
            )}
          </div>
        </div>
        {discount > 0 && (
          <div className="summary-row discount">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-row grand-total">
          <span>Grand Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
