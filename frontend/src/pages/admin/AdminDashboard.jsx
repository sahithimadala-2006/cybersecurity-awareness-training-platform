import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

function AdminDashboard() {
  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="admin-main">

        {/* Header */}
        <AdminHeader />

        <div className="dashboard-content">

          {/* Welcome Section */}
          <section className="welcome-card">
            <h1>Welcome, Administrator! 👋</h1>

            <p>
              Monitor employee cybersecurity awareness,
              training progress, and platform activity.
            </p>
          </section>


          {/* Statistics */}
          <section className="stats-grid">

            <div className="stat-card">
              <h3>Total Employees</h3>

              <div className="stat-number">
                100
              </div>

              <span>
                Registered employees
              </span>
            </div>


            <div className="stat-card">
              <h3>Active Courses</h3>

              <div className="stat-number">
                8
              </div>

              <span>
                Available training courses
              </span>
            </div>


            <div className="stat-card">
              <h3>Average Score</h3>

              <div className="stat-number">
                82%
              </div>

              <span>
                Employee average score
              </span>
            </div>


            <div className="stat-card">
              <h3>Completion Rate</h3>

              <div className="stat-number">
                76%
              </div>

              <span>
                Overall training completion
              </span>
            </div>

          </section>


          {/* Training Overview */}
          <section className="dashboard-section">

            <h2>Training Overview</h2>

            <div className="overview-grid">

              <div>
                <h3>Course Completion</h3>

                <progress
                  value="76"
                  max="100"
                ></progress>

                <p>76% completed</p>
              </div>


              <div>
                <h3>Quiz Performance</h3>

                <progress
                  value="82"
                  max="100"
                ></progress>

                <p>82% average score</p>
              </div>


              <div>
                <h3>Simulation Success</h3>

                <progress
                  value="71"
                  max="100"
                ></progress>

                <p>71% successful attempts</p>
              </div>

            </div>

          </section>


          {/* Recent Activity */}
          <section className="dashboard-section">

            <div className="section-header">

              <div>
                <h2>Recent Employee Activity</h2>

                <p>
                  Latest cybersecurity training activities
                </p>
              </div>

            </div>


            <div className="table-card">

              <table>

                <thead>

                  <tr>
                    <th>Employee</th>
                    <th>Activity</th>
                    <th>Course</th>
                    <th>Score</th>
                    <th>Status</th>
                  </tr>

                </thead>


                <tbody>

                  <tr>
                    <td>Pavani</td>
                    <td>Completed Quiz</td>
                    <td>Phishing Awareness</td>
                    <td>92%</td>
                    <td>
                      <span className="status completed">
                        Completed
                      </span>
                    </td>
                  </tr>


                  <tr>
                    <td>Chaitanya</td>
                    <td>Started Course</td>
                    <td>Malware Awareness</td>
                    <td>--</td>
                    <td>
                      <span className="status progress">
                        In Progress
                      </span>
                    </td>
                  </tr>


                  <tr>
                    <td>Satya Sahithi</td>
                    <td>Completed Simulation</td>
                    <td>Phishing Simulation</td>
                    <td>88%</td>
                    <td>
                      <span className="status completed">
                        Completed
                      </span>
                    </td>
                  </tr>


                  <tr>
                    <td>Ravi</td>
                    <td>Started Course</td>
                    <td>Social Engineering</td>
                    <td>--</td>
                    <td>
                      <span className="status progress">
                        In Progress
                      </span>
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </section>


          {/* Cybersecurity Modules */}
          <section className="dashboard-section">

            <h2>Training Modules</h2>

            <div className="course-grid">

              <div className="course-card">

                <div className="course-icon">
                  🎣
                </div>

                <h3>Phishing Awareness</h3>

                <p>
                  Learn how to identify suspicious
                  emails, links, and messages.
                </p>

                <strong>
                  85% Completion
                </strong>

              </div>


              <div className="course-card">

                <div className="course-icon">
                  🦠
                </div>

                <h3>Malware Awareness</h3>

                <p>
                  Understand malware types and
                  safe cybersecurity practices.
                </p>

                <strong>
                  72% Completion
                </strong>

              </div>


              <div className="course-card">

                <div className="course-icon">
                  🕵️
                </div>

                <h3>Social Engineering</h3>

                <p>
                  Learn how attackers manipulate
                  people to obtain sensitive information.
                </p>

                <strong>
                  68% Completion
                </strong>

              </div>

            </div>

          </section>


          {/* Simulation Results */}
          <section className="dashboard-section">

            <h2>Phishing Simulation Results</h2>

            <div className="simulation-summary">

              <div className="simulation-stat">
                <span>Total Employees Tested</span>
                <strong>100</strong>
              </div>

              <div className="simulation-stat">
                <span>Identified Phishing</span>
                <strong>71</strong>
              </div>

              <div className="simulation-stat">
                <span>Clicked Suspicious Link</span>
                <strong>29</strong>
              </div>

              <div className="simulation-stat">
                <span>Detection Rate</span>
                <strong>71%</strong>
              </div>

            </div>

          </section>


          {/* Quick Actions */}
          <section className="dashboard-section">

            <h2>Quick Actions</h2>

            <div className="quick-actions">

              <button>
                + Add Employee
              </button>

              <button>
                + Create Course
              </button>

              <button>
                + Create Quiz
              </button>

              <button>
                Start Simulation
              </button>

              <button>
                View Reports
              </button>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;