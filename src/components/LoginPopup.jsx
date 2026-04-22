import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";

const LoginPopup = ({ setIsLoginOpen }) => {
  const { login, register } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (currState === "Sign Up" && !form.name.trim())
      e.name = "Name is required.";
    if (currState === "Sign Up" && form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (currState === "Sign Up" && form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    else if (
      currState === "Sign Up" &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(form.password)
    )
      e.password = "Must include uppercase, lowercase, and a number.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      if (currState === "Sign Up") {
        await register(form.name, form.email, form.password);
      }
      await login(form.email, form.password);
      setIsLoginOpen(false);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    setCurrState(mode);
    setErrors({});
    setApiError("");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="login-popup">
      <form
        className="login-popup-container"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setIsLoginOpen(false)}
            src={assets.cross_icon}
            alt="Close"
            className="close-icon"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <div className="field-group">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </div>
          )}
          <div className="field-group">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>
          <div className="field-group password-group">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🔓" : "🔒"}
            </button>
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>
        </div>

        {apiError && <p className="api-error">{apiError}</p>}

        <button className="login-popup-btn" type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : currState === "Sign Up"
              ? "Create Account"
              : "Login"}
        </button>

        {currState === "Sign Up" && (
          <div className="login-pop-condition">
            <input type="checkbox" required />
            <p>
              I agree to the <span>Terms of Service</span> and{" "}
              <span>Privacy Policy</span>.
            </p>
          </div>
        )}

        {currState === "Login" ? (
          <p>
            Don't have an account?{" "}
            <span onClick={() => switchMode("Sign Up")}>Click Here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => switchMode("Login")}>Login</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
