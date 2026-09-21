import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function EmployeeDashboard() {

  const employee = {
    name: "Rahul",
    awarenessScore: 82,
    trainingProgress: 76,
    coursesCompleted: 4,
    totalCourses: 6,
    quizAverage: 85,
  };

  const recentActivity = [
    {
      title: "Phishing Awareness",
      type: "Training",
      status: "Completed",
      score: "90%",
    },
    {
      title: "Password Security Quiz",
      type: "Quiz",
      status: "Completed",
      score: "85%",
    },
    {
      title: "Social Engineering Simulation",
      type: "Simulation",
      status: "Pending",
      score: "-",
    },
  ];

  return (
    <div className="employee-layout">

      <Sidebar />

      <main className="employee-main">

        <div className="employee-dashboard">

          {/* Header */}
          <div className="dashboard-header">

            <div>
              <h1>Welcome, {employee.name}! 👋</h1>

              <p>
                Continue your cybersecurity awareness training
                and improve your security skills.
              </p>
            </div>

          </div>


          {/* Statistics */}
          <div className="employee-stats">

            <div className="employee-stat-card">
              <h3>Overall Awareness Score</h3>

              <p className="stat-value">
                {employee.awarenessScore}%
              </p>

              <span>Good</span>
            </div>


            <div className="employee-stat-card">

              <h3>Training Progress</h3>

              <p className="stat-value">
                {employee.trainingProgress}%
              </p>

              <span>
                {employee.coursesCompleted} of{" "}
                {employee.totalCourses} courses
              </span>

            </div>


            <div className="employee-stat-card">

              <h3>Courses Completed</h3>

              <p className="stat-value">
                {employee.coursesCompleted}
              </p>

              <span>
                Total: {employee.totalCourses}
              </span>

            </div>


            <div className="employee-stat-card">

              <h3>Average Quiz Score</h3>

              <p className="stat-value">
                {employee.quizAverage}%
              </p>

              <span>
                Keep improving!
              </span>

            </div>

          </div>


          {/* Continue Training */}
          <section className="dashboard-section">

            <div className="section-header">

              <div>
                <h2>Continue Training</h2>

                <p>
                  Pick up where you left off.
                </p>
              </div>

              <Link to="/employee/courses">
                View All Courses
              </Link>

            </div>


            <div className="training-card">

              <div>

                <h3>
                  Phishing Awareness
                </h3>

                <p>
                  Learn how to identify phishing emails,
                  suspicious links, and common phishing
                  techniques.
                </p>

                <div className="progress-container">

                  <div className="progress-label">
                    <span>Progress</span>
                    <span>80%</span>
                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{ width: "80%" }}
                    />

                  </div>

                </div>

              </div>


              <Link
                to="/employee/course-details"
                className="continue-button"
              >
                Continue Training
              </Link>

            </div>

          </section>


          {/* Quick Actions */}
          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Continue your cybersecurity activities.
                </p>

              </div>

            </div>


            <div className="quick-actions">

              <Link
                to="/employee/courses"
                className="quick-action-card"
              >
                <h3>📚 Courses</h3>

                <p>
                  Explore cybersecurity training modules.
                </p>

              </Link>


              <Link
                to="/employee/quiz"
                className="quick-action-card"
              >
                <h3>📝 Take a Quiz</h3>

                <p>
                  Test your cybersecurity knowledge.
                </p>

              </Link>


              <Link
                to="/employee/simulation"
                className="quick-action-card"
              >
                <h3>🎯 Simulations</h3>

                <p>
                  Practice identifying cyber threats.
                </p>

              </Link>


              <Link
                to="/employee/progress"
                className="quick-action-card"
              >
                <h3>📊 My Progress</h3>

                <p>
                  View your training performance.
                </p>

              </Link>

            </div>

          </section>


          {/* Recent Activity */}
          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  Recent Activity
                </h2>

                <p>
                  Your latest training activities.
                </p>

              </div>

            </div>


            <div className="activity-table">

              <table>

                <thead>

                  <tr>
                    <th>Activity</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Score</th>
                  </tr>

                </thead>


                <tbody>

                  {recentActivity.map(
                    (activity, index) => (

                      <tr key={index}>

                        <td>
                          {activity.title}
                        </td>

                        <td>
                          {activity.type}
                        </td>

                        <td>
                          {activity.status}
                        </td>

                        <td>
                          {activity.score}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default EmployeeDashboard;