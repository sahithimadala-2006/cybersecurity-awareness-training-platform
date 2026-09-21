import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Check password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Check if employee already exists
    const existingEmployee = localStorage.getItem("employee");

    if (existingEmployee) {
      const employee = JSON.parse(existingEmployee);

      if (employee.email === email) {
        setError("An account with this email already exists.");
        return;
      }
    }

    // Create employee account
    const employee = {
      name,
      email,
      password,
      department,
      role: "EMPLOYEE",
      status: "Active",
      awarenessScore: 0,
      trainingProgress: 0,
      coursesCompleted: 0,
      totalCourses: 6,
      quizAverage: 0,
    };

    // Save employee account
    localStorage.setItem("employee", JSON.stringify(employee));

    // Clear form
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setDepartment("");

    // Go to login page
    navigate("/login");
  };

  return (
    <div className="login-page">

      <div className="login-card register-card">

        {/* TITLE */}
        <h1>CyberSafe</h1>

        <h2>Create Account</h2>

        <p className="login-subtitle">
          Register as an employee to access the cybersecurity
          awareness training platform.
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

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="login-field">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="login-field">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

          {/* DEPARTMENT */}
          <div className="login-field">
            <label htmlFor="department">
              Department
            </label>

            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">
                Select Department
              </option>

              <option value="IT">
                IT
              </option>

              <option value="HR">
                Human Resources
              </option>

              <option value="Finance">
                Finance
              </option>

              <option value="Marketing">
                Marketing
              </option>

              <option value="Operations">
                Operations
              </option>
            </select>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="login-button"
          >
            Create Employee Account
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="register-text">
          Already have an account?{" "}
          <Link to="/login">
            Employee Login
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

export default Register;