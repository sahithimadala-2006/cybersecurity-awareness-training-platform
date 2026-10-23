import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");

    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">

      {/* ================================
          BRAND
      ================================= */}
      <div className="sidebar-brand">
        <h1>CyberSafe</h1>
        <p>Admin Panel</p>
      </div>


      {/* ================================
          NAVIGATION
      ================================= */}
      <nav className="admin-nav">

        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">▣</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>


        {/* Users */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">●</span>
          <span className="nav-text">Users</span>
        </NavLink>


        {/* Courses */}
        <NavLink
          to="/admin/courses"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">▤</span>
          <span className="nav-text">Courses</span>
        </NavLink>


        {/* Quizes */}
        <NavLink
          to="/admin/quizes"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">✓</span>
          <span className="nav-text">Quizes</span>
        </NavLink>


        {/* Simulations */}
        <NavLink
          to="/admin/simulations"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">⚡</span>
          <span className="nav-text">Simulations</span>
        </NavLink>


        {/* Reports */}
        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">▥</span>
          <span className="nav-text">Reports</span>
        </NavLink>

      </nav>


      {/* ================================
          LOGOUT
      ================================= */}
      <div className="sidebar-logout">

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          <span className="logout-icon">↪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default AdminSidebar;