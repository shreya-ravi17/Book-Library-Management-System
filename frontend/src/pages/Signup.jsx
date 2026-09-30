import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      await api.post(
        "/auth/signup",
        formData
      );

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual signup-visual">
        <div className="visual-content">
          <div className="brand-mark">BL</div>

          <p className="eyebrow">YOUR READING SPACE</p>

          <h1>
            Build your
            <span> collection.</span>
          </h1>

          <p className="visual-description">
            Create your personal library and keep every title within reach.
          </p>

          <div className="book-stack">
            <div className="stack-book book-one">FICTION</div>
            <div className="stack-book book-two">CLASSICS</div>
            <div className="stack-book book-three">SCIENCE</div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-container">
          <div className="mobile-brand">BOOK LIBRARY</div>

          <p className="form-label">GET STARTED</p>

          <h2>Create your account</h2>

          <p className="form-subtitle">
            Your personal library starts here.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create My Library →"}
            </button>
          </form>

          <p className="switch-auth">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;