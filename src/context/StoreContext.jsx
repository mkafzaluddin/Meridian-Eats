import { createContext, useContext, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;
export const StoreContext = createContext(null);

// ── Fetch wrapper that handles 401 globally ───────────────────────────
function makeApiFetch(getToken, onUnauthorized) {
  return async function apiFetch(url, options = {}) {
    const token = getToken();
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      onUnauthorized();
      throw new Error("Session expired. Please sign in again.");
    }
    return res;
  };
}

export function StoreProvider({ children }) {
  const [foodList, setFoodList] = useState([]);
  const [categories, setCategories] = useState([]); // ← from API
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  // apiFetch always reads the latest token via closure
  const apiFetch = makeApiFetch(
    () => localStorage.getItem("token"),
    () => {
      // auto-logout on 401
      setToken("");
      setUser(null);
      setCartItems({});
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  );

  // ── Food & Categories ─────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/food`)
      .then((r) => r.json())
      .then(setFoodList)
      .catch(console.error);

    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // ── Cart ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (token) fetchCart();
    else setCartItems({});
  }, [token]);

  async function fetchCart() {
    try {
      const res = await apiFetch(`${API}/cart`);
      const data = await res.json();
      const map = {};
      data.forEach((item) => {
        map[item.foodItemId] = item.quantity;
      });
      setCartItems(map);
    } catch (err) {
      console.error(err);
    }
  }

  async function addToCart(foodItemId) {
    setCartItems((prev) => ({
      ...prev,
      [foodItemId]: (prev[foodItemId] || 0) + 1,
    }));
    if (token) {
      await apiFetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodItemId, quantity: 1 }),
      }).catch(console.error);
    }
  }

  async function removeFromCart(foodItemId) {
    setCartItems((prev) => {
      const qty = (prev[foodItemId] || 0) - 1;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[foodItemId];
        return next;
      }
      return { ...prev, [foodItemId]: qty };
    });
    if (token) {
      try {
        const res = await apiFetch(`${API}/cart`);
        const data = await res.json();
        const item = data.find((i) => i.foodItemId === foodItemId);
        if (!item) return;
        const newQty = item.quantity - 1;
        if (newQty <= 0) {
          await apiFetch(`${API}/cart/${item.id}`, { method: "DELETE" });
        } else {
          await apiFetch(`${API}/cart/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: newQty }),
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  function getTotalCartAmount() {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const food = foodList.find((f) => f.id === Number(id));
      return food ? total + food.price * qty : total;
    }, 0);
  }

  function getTotalCartCount() {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  }

  // ── Auth ──────────────────────────────────────────────────────────
  async function login(email, password) {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed.");
    const userData = { name: data.name, email: data.email, role: data.role };
    setToken(data.token);
    setUser(userData);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    return data;
  }

  async function register(name, email, password) {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed.");
    return data;
  }

  function logout() {
    setToken("");
    setUser(null);
    setCartItems({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // ── Orders ────────────────────────────────────────────────────────
  async function placeOrder(deliveryInfo) {
    const res = await apiFetch(`${API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deliveryInfo),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Order failed.");
    setCartItems({});
    return data;
  }

  async function getMyOrders() {
    const res = await apiFetch(`${API}/orders`);
    return res.json();
  }

  const value = {
    foodList,
    categories,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartCount,
    token,
    user,
    login,
    register,
    logout,
    placeOrder,
    getMyOrders,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
