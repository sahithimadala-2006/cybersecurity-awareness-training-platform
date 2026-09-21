import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Temporary demo admin credentials
    if (
      email === "admin@cybersafe.com" &&
      password === "Admin@123"
    ) {
      // Store login information
      localStorage.setItem("userRole", "ADMIN");
      localStorage.setItem("isLoggedIn", "true");

      // Go to admin dashboard
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin email or password");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* TITLE */}
        <h1>CyberSafe</h1>

        <h2>Admin Login</h2>

        <p className="login-subtitle">
          Sign in to access the administration panel.
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <p
            className="error-message"
            style={{
              color: "#dc2626",
              fontSize: "14px",
              marginBottom: "15px",
            }}
          >
            {error}
          </p>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="login-field">

            <label htmlFor="admin-email">
              Admin Email
            </label>

            <input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="login-field">

            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

          {/* FORGOT PASSWORD */}
          <div className="forgot-password">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-button"
          >
            Login as Admin
          </button>

        </form>

        {/* EMPLOYEE LOGIN */}
        <p className="register-text">
          Are you an employee?{" "}
          <Link to="/login">
            Employee Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default AdminLogin;