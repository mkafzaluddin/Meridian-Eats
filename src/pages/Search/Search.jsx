import React, { useState, useContext } from "react";
import "./Search.css";
import { StoreContext } from "../../context/StoreContext";
import { getImage } from "../../utils/getImage";
import { assets } from "../../assets/assets";

export default function Search() {
  const { foodList, categories, addToCart, removeFromCart, cartItems } =
    useContext(StoreContext);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce — wait 300ms after user stops typing
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);
  const [category, setCategory] = useState("All");

  const filtered = foodList.filter((item) => {
    const matchCat =
      category === "All" ||
      (item.categoryName || "").toLowerCase() === category.toLowerCase();
    const matchSearch = item.name
      .toLowerCase()
      .includes(debouncedQuery.toLowerCase().trim());
    return matchCat && matchSearch && item.isAvailable;
  });

  return (
    <div className="search-container">
      <h1 className="search-title">Search Food</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for dishes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="menu-list">
        <button
          className={category === "All" ? "active" : ""}
          onClick={() => setCategory("All")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={category === cat.name ? "active" : ""}
            onClick={() => setCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="search-results">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const count = cartItems[item.id] || 0;
            return (
              <div className="food-card" key={item.id}>
                <div className="food-card-img-wrapper">
                  <img src={getImage(item.imageUrl)} alt={item.name} />
                  <div className="food-card-controls">
                    {count === 0 ? (
                      <button
                        className="btn-add-white"
                        onClick={() => addToCart(item.id)}
                      >
                        <img src={assets.add_icon_white} alt="Add" />
                      </button>
                    ) : (
                      <div className="food-card-counter">
                        <button onClick={() => removeFromCart(item.id)}>
                          <img src={assets.remove_icon_red} alt="-" />
                        </button>
                        <span>{count}</span>
                        <button onClick={() => addToCart(item.id)}>
                          <img src={assets.add_icon_green} alt="+" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="food-info">
                  <div className="food-name-row">
                    <h3>{item.name}</h3>
                    <img
                      src={assets.rating_starts}
                      alt="rating"
                      className="rating-stars"
                    />
                  </div>
                  <p className="food-description">{item.description}</p>
                  <p className="food-price">${item.price}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-food">
            <p>No dishes found 🍽️</p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
