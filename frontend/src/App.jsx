import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import AdminLogin from "./pages/auth/AdminLogin";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import Reports from "./pages/admin/reports";
import Users from "./pages/admin/Users";
import ManageQuizzes from "./pages/admin/ManageQuizes";
import ManageSimulations from "./pages/admin/ManageSimulation";
import ManageCourses from "./pages/admin/ManageCourses";

// Employee
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import Courses from "./pages/employee/Courses";
import CourseDetails from "./pages/employee/CourseDetails";
import Quiz from "./pages/employee/Quiz";
import QuizResult from "./pages/employee/QuizResult";
import Simulation from "./pages/employee/Simulation";
import Progress from "./pages/employee/progress";
import Certificates from "./pages/employee/Certificates";
import Profile from "./pages/employee/Profile";

function App() {
  return (
    <Routes>

      {/* ================= AUTH ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


      {/* ================= EMPLOYEE ================= */}

      <Route
        path="/employee/dashboard"
        element={<EmployeeDashboard />}
      />

      <Route
        path="/employee/courses"
        element={<Courses />}
      />

      <Route
        path="/employee/course-details"
        element={<CourseDetails />}
      />

      <Route
        path="/employee/quiz"
        element={<Quiz />}
      />

      <Route
        path="/employee/quiz-result"
        element={<QuizResult />}
      />

      <Route
        path="/employee/simulation"
        element={<Simulation />}
      />

      <Route
        path="/employee/progress"
        element={<Progress />}
      />

      <Route
        path="/employee/certificates"
        element={<Certificates />}
      />

      <Route
        path="/employee/profile"
        element={<Profile />}
      />


      {/* ================= ADMIN ================= */}

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/users"
        element={<Users />}
      />

      <Route
        path="/admin/courses"
        element={<ManageCourses />}
      />

      <Route
        path="/admin/quizes"
        element={<ManageQuizzes />}
      />

      <Route
        path="/admin/simulations"
        element={<ManageSimulations />}
      />

      <Route
        path="/admin/reports"
        element={<Reports />}
      />


      {/* ================= DEFAULT ================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/admin/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;