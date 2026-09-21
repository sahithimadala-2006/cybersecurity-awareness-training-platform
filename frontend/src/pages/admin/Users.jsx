import { useState } from "react";
import AdminSidebar from "../../Components/Admin/AdminSidebar";

function Users() {
  // ========================================
  // SEARCH & FILTER
  // ========================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ========================================
  // ADD EMPLOYEE FORM
  // ========================================

  const [showForm, setShowForm] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    department: "",
    status: "Active",
  });

  // ========================================
  // EMPLOYEE DATA
  // ========================================

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahul Kumar",
      email: "rahul@company.com",
      department: "IT",
      status: "Active",
      progress: 85,
      score: 88,
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@company.com",
      department: "HR",
      status: "Active",
      progress: 92,
      score: 95,
    },
    {
      id: 3,
      name: "Arjun Reddy",
      email: "arjun@company.com",
      department: "Finance",
      status: "Inactive",
      progress: 45,
      score: 61,
    },
    {
      id: 4,
      name: "Sneha Rao",
      email: "sneha@company.com",
      department: "Marketing",
      status: "Active",
      progress: 76,
      score: 82,
    },
    {
      id: 5,
      name: "Vikram Singh",
      email: "vikram@company.com",
      department: "IT",
      status: "Active",
      progress: 68,
      score: 74,
    },
  ]);

  // ========================================
  // SEARCH & FILTER LOGIC
  // ========================================

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.department.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ========================================
  // FORM INPUT HANDLER
  // ========================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // ========================================
  // ADD EMPLOYEE
  // ========================================

  const handleAddEmployee = (e) => {
    e.preventDefault();

    if (
      !newUser.name.trim() ||
      !newUser.email.trim() ||
      !newUser.department
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const employee = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      department: newUser.department,
      status: newUser.status,
      progress: 0,
      score: 0,
    };

    setUsers((previousUsers) => [
      ...previousUsers,
      employee,
    ]);

    setNewUser({
      name: "",
      email: "",
      department: "",
      status: "Active",
    });

    setShowForm(false);

    alert("Employee added successfully!");
  };

  // ========================================
  // CANCEL ADD EMPLOYEE
  // ========================================

  const handleCancel = () => {
    setNewUser({
      name: "",
      email: "",
      department: "",
      status: "Active",
    });

    setShowForm(false);
  };

  // ========================================
  // VIEW EMPLOYEE
  // ========================================

  const handleViewEmployee = (user) => {
    alert(
      `Employee Details\n\n` +
        `Name: ${user.name}\n` +
        `Email: ${user.email}\n` +
        `Department: ${user.department}\n` +
        `Status: ${user.status}\n` +
        `Training Progress: ${user.progress}%\n` +
        `Quiz Score: ${user.score}%`
    );
  };

  // ========================================
  // STATISTICS
  // ========================================

  const totalEmployees = users.length;

  const activeEmployees = users.filter(
    (user) => user.status === "Active"
  ).length;

  const trainingCompleted =
    users.length > 0
      ? Math.round(
          users.reduce(
            (total, user) => total + user.progress,
            0
          ) / users.length
        )
      : 0;

  const averageScore =
    users.length > 0
      ? Math.round(
          users.reduce(
            (total, user) => total + user.score,
            0
          ) / users.length
        )
      : 0;

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="admin-layout">

      {/* =====================================
          ADMIN SIDEBAR
      ====================================== */}

      <AdminSidebar />


      {/* =====================================
          ADMIN MAIN AREA
      ====================================== */}

      <main className="admin-main">

        <div className="dashboard-content">

          {/* =====================================
              PAGE TITLE
          ====================================== */}

          <div className="page-title">

            <div>
              <h2>User Management</h2>

              <p>
                Manage employees and monitor their
                cybersecurity training progress.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
            >
              + Add Employee
            </button>

          </div>


          {/* =====================================
              ADD EMPLOYEE FORM
          ====================================== */}

          {showForm && (
            <div className="form-card">

              <div className="page-title">

                <div>
                  <h2>Add Employee</h2>

                  <p>
                    Create a new employee account.
                  </p>
                </div>

              </div>


              <form onSubmit={handleAddEmployee}>

                {/* Employee Name */}

                <div className="form-group">

                  <label>
                    Employee Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter employee name"
                    value={newUser.name}
                    onChange={handleInputChange}
                  />

                </div>


                {/* Email */}

                <div className="form-group">

                  <label>
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter employee email"
                    value={newUser.email}
                    onChange={handleInputChange}
                  />

                </div>


                {/* Department */}

                <div className="form-group">

                  <label>
                    Department *
                  </label>

                  <select
                    name="department"
                    value={newUser.department}
                    onChange={handleInputChange}
                  >

                    <option value="">
                      Select Department
                    </option>

                    <option value="IT">
                      IT
                    </option>

                    <option value="HR">
                      HR
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


                {/* Status */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={newUser.status}
                    onChange={handleInputChange}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>


                {/* Form Buttons */}

                <div className="form-buttons">

                  <button type="submit">
                    Add Employee
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>
          )}


          {/* =====================================
              USER STATISTICS
          ====================================== */}

          <div className="stats-grid">

            {/* Total Employees */}

            <div className="stat-card">

              <h3>
                Total Employees
              </h3>

              <div className="stat-number">
                {totalEmployees}
              </div>

              <span>
                Registered employees
              </span>

            </div>


            {/* Active Employees */}

            <div className="stat-card">

              <h3>
                Active Employees
              </h3>

              <div className="stat-number">
                {activeEmployees}
              </div>

              <span>
                Currently active
              </span>

            </div>


            {/* Training Completed */}

            <div className="stat-card">

              <h3>
                Training Completed
              </h3>

              <div className="stat-number">
                {trainingCompleted}%
              </div>

              <span>
                Overall completion
              </span>

            </div>


            {/* Average Score */}

            <div className="stat-card">

              <h3>
                Average Score
              </h3>

              <div className="stat-number">
                {averageScore}%
              </div>

              <span>
                Employee average
              </span>

            </div>

          </div>


          {/* =====================================
              SEARCH AND FILTER
          ====================================== */}

          <div className="dashboard-section">

            <div className="course-controls">

              {/* Search */}

              <input
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />


              {/* Status Filter */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>


          {/* =====================================
              USERS TABLE
          ====================================== */}

          <div className="table-card">

            <table>

              <thead>

                <tr>

                  <th>
                    Employee
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Progress
                  </th>

                  <th>
                    Quiz Score
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.map((user) => (

                  <tr key={user.id}>

                    {/* Employee */}

                    <td>

                      <strong>
                        {user.name}
                      </strong>

                      <br />

                      <span>
                        {user.email}
                      </span>

                    </td>


                    {/* Department */}

                    <td>
                      {user.department}
                    </td>


                    {/* Status */}

                    <td>

                      <span
                        className={
                          user.status === "Active"
                            ? "status completed"
                            : "status progress"
                        }
                      >
                        {user.status}
                      </span>

                    </td>


                    {/* Progress */}

                    <td>

                      <progress
                        value={user.progress}
                        max="100"
                      />

                      <br />

                      {user.progress}%

                    </td>


                    {/* Quiz Score */}

                    <td>

                      <strong>
                        {user.score}%
                      </strong>

                    </td>


                    {/* Action */}

                    <td>

                      <button
                        onClick={() =>
                          handleViewEmployee(user)
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>


            {/* =====================================
                EMPTY STATE
            ====================================== */}

            {filteredUsers.length === 0 && (

              <div className="empty-state">

                <h3>
                  No employees found
                </h3>

                <p>
                  Try changing your search or filter.
                </p>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Users;