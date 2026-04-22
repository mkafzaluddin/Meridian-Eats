import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../context/StoreContext";
import FoodItem from "./FoodItem";

const FoodDisplay = ({ category }) => {
  const { foodList } = useContext(StoreContext);

  if (!foodList || foodList.length === 0) {
    return (
      <div className="food-display-loading">
        <div className="food-spinner" />
        <p>Loading delicious food...</p>
      </div>
    );
  }

  const filtered = foodList.filter(
    (item) =>
      (category === "All" || item.categoryName === category) &&
      item.isAvailable,
  );

  return (
    <div className="food-display">
      <h2>Top Dishes Near You</h2>
      {filtered.length === 0 ? (
        <p className="food-display-empty">No dishes found in this category.</p>
      ) : (
        <div className="food-display-list">
          {filtered.map((item) => (
            <FoodItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.imageUrl}
              rating={item.rating}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
