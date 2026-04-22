import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import PastOrders from "./pages/PastOrders/PastOrders";
import Search from "./pages/Search/Search";
import Footer from "./components/Footer";
import LoginPopup from "./components/LoginPopup";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminFoods from "./pages/Admin/AdminFoods";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminOrders from "./pages/Admin/AdminOrders";
import OrderTracking from "./pages/OrderTracking/OrderTracking";
import Menu from "./pages/Menu/Menu";
import { useStore } from "./context/StoreContext";
import NotFound from "./pages/NotFound/NotFound";

// ── Route guards ──────────────────────────────────────────────────────
function ProtectedRoute({ children, onLoginRequired }) {
  const { token } = useStore();
  if (!token) {
    onLoginRequired();
    return <Navigate to="/" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { token, user } = useStore();
  if (!token || user?.role !== "Admin") return <Navigate to="/" replace />;
  return children;
}

// ── Customer layout wrapper ───────────────────────────────────────────
function CustomerLayout({ setIsLoginOpen }) {
  return (
    <div className="app">
      <Navbar setIsLoginOpen={setIsLoginOpen} />
      <Outlet />
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────
const App = () => {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  return (
    <>
      {isLoginOpen && <LoginPopup setIsLoginOpen={setIsLoginOpen} />}

      <Routes>
        {/* ── Admin routes — no Navbar ── */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="foods" element={<AdminFoods />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* ── Customer routes — with Navbar ── */}
        <Route element={<CustomerLayout setIsLoginOpen={setIsLoginOpen} />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/search" element={<Search />} />
          <Route path="/contact" element={<Footer />} />
          <Route
            path="/cart"
            element={<Cart setIsLoginOpen={setIsLoginOpen} />}
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute onLoginRequired={() => setIsLoginOpen(true)}>
                <PlaceOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute onLoginRequired={() => setIsLoginOpen(true)}>
                <PastOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track/:id"
            element={
              <ProtectedRoute onLoginRequired={() => setIsLoginOpen(true)}>
                <OrderTracking />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
