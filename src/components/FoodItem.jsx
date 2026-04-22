import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";
import { getImage } from "../utils/getImage";
import { Link } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";

const FoodItem = ({ id, name, description, price, image, rating }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const count = cartItems[id] || 0;

  return (
    <div className="food-item">
      <div className="food-item-image">
        <img src={getImage(image)} alt={name} />

        {count === 0 ? (
          <button className="btn add-btn" onClick={() => addToCart(id)}>
            <img src={assets.add_icon_white} alt="Add" />
          </button>
        ) : (
          <div className="counter">
            <button
              className="counter-btn subtract"
              onClick={() => removeFromCart(id)}
            >
              <img src={assets.remove_icon_red} alt="Subtract" />
            </button>
            <span className="counter-value">{count}</span>
            <button className="counter-btn add" onClick={() => addToCart(id)}>
              <img src={assets.add_icon_green} alt="Add" />
            </button>
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p className="name">{name}</p>
          <div className="food-rating">
            <span className="food-rating-star">⭐</span>
            <span className="food-rating-num">{rating || "4.0"}</span>
          </div>
        </div>
      </div>

      <div className="food-item-description">{description}</div>
      <div className="food-item-price">${price}</div>
    </div>
  );
};

export default FoodItem;
