import React, { useContext } from "react";
import "./ExploreMenu.css";
import { StoreContext } from "../context/StoreContext";

const ExploreMenu = ({ category, setCategory }) => {
  const { categories } = useContext(StoreContext);

  return (
    <div className="explore-menu" id="explore-menu">
      <h2>Explore Menu</h2>
      <p className="explore-menu-text">
        Discover a wide variety of delicious dishes from our extensive menu.
      </p>
      <hr />
      <div className="explore-menu-items">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`explore-menu-item ${category === cat.name ? "active" : ""}`}
            onClick={() =>
              setCategory((prev) => (prev === cat.name ? "All" : cat.name))
            }
          >
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="explore-menu-item-image"
              width="110"
              height="110"
              onError={(e) => (e.target.style.display = "none")}
            />
            <h3 className="explore-menu-item-name">{cat.name}</h3>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
