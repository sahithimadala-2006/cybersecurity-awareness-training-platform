import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Get registered employee
    const storedEmployee = localStorage.getItem("employee");

    // No employee account found
    if (!storedEmployee) {
      setError(
        "No employee account found. Please register first."
      );
      return;
    }

    const employee = JSON.parse(storedEmployee);

    // Check credentials
    if (
      employee.email === email &&
      employee.password === password
    ) {
      // Save login information
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "EMPLOYEE");

      // Go to employee dashboard
      navigate("/employee/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* TITLE */}
        <h1>CyberSafe</h1>

        <p className="login-subtitle">
          Cybersecurity Awareness Training Platform
        </p>

        <h2>Employee Login</h2>

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

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="login-field">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="login-field">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
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
            Login
          </button>

        </form>

        {/* REGISTRATION */}
        <p className="register-text">
          Don't have an employee account?{" "}
          <Link to="/register">
            Employee Registration
          </Link>
        </p>

        {/* ADMIN LOGIN */}
        <p className="admin-login-text">
          Are you an administrator?{" "}
          <Link to="/admin/login">
            Admin Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;