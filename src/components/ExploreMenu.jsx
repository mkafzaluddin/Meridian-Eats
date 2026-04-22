import React, { useContext } from "react";
import "./ExploreMenu.css";
import { StoreContext } from "../context/StoreContext";
import { menu_list } from "../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  const { categories } = useContext(StoreContext);

  const menuItems = categories.map((cat, i) => ({
    ...cat,
    menu_image: menu_list[i]?.menu_image ?? null,
  }));

  return (
    <div className="explore-menu" id="explore-menu">
      <h2>Explore Menu</h2>
      <p className="explore-menu-text">
        Discover a wide variety of delicious dishes from our extensive menu.
      </p>
      <hr />
      <div className="explore-menu-items">
        {menuItems.map((cat) => (
          <div
            key={cat.id}
            className={`explore-menu-item ${category === cat.name ? "active" : ""}`}
            onClick={() =>
              setCategory((prev) => (prev === cat.name ? "All" : cat.name))
            }
          >
            {cat.menu_image && (
              <img
                src={cat.menu_image}
                alt={cat.name}
                className="explore-menu-item-image"
              />
            )}
            <h3 className="explore-menu-item-name">{cat.name}</h3>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
