import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");

    navigate("/login");
  };

  return (
    <aside className="employee-sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">🛡️</div>

        <div>
          <h2>CyberSafe</h2>
          <span>Employee Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">

        <NavLink
          to="/employee/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">🏠</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/employee/courses"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">📚</span>
          <span>Courses</span>
        </NavLink>

        <NavLink
          to="/employee/quiz"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">📝</span>
          <span>Quizzes</span>
        </NavLink>

        <NavLink
          to="/employee/simulation"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">🎯</span>
          <span>Simulations</span>
        </NavLink>

        <NavLink
          to="/employee/progress"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">📊</span>
          <span>My Progress</span>
        </NavLink>

        <NavLink
          to="/employee/certificates"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">🏆</span>
          <span>Certificates</span>
        </NavLink>

        <NavLink
          to="/employee/profile"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">👤</span>
          <span>Profile</span>
        </NavLink>

      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">🚪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;