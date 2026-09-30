import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem("libraryUser", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="visual-content">
          <div className="brand-mark">BL</div>

          <p className="eyebrow">BOOK LIBRARY</p>

          <h1>
            Every book has
            <span> a place.</span>
          </h1>

          <p className="visual-description">
            Organize your collection, discover your next read, and keep your
            library beautifully managed.
          </p>

          <div className="floating-book">
            <div className="book-spine"></div>
            <div className="book-cover">
              <span>YOUR</span>
              <strong>LIBRARY</strong>
              <small>EST. 2026</small>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-container">
          <div className="mobile-brand">BOOK LIBRARY</div>

          <p className="form-label">WELCOME BACK</p>

          <h2>Sign in to your library</h2>

          <p className="form-subtitle">
            Continue managing your collection.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Enter Library →"}
            </button>
          </form>

          <p className="switch-auth">
            Don't have an account?{" "}
            <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;