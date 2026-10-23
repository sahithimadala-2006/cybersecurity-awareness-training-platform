import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function Progress() {

  const quizScore =
    Number(
      localStorage.getItem("quizScore")
    ) || 85;


  const simulationScore =
    Number(
      localStorage.getItem("simulationScore")
    ) || 90;


  const courses = [
    {
      name: "Phishing Awareness",
      progress: 80,
    },

    {
      name: "Password Security",
      progress: 100,
    },

    {
      name: "Social Engineering",
      progress: 60,
    },

    {
      name: "Malware Awareness",
      progress: 40,
    },

    {
      name: "Safe Internet Practices",
      progress: 20,
    },

    {
      name: "Data Protection",
      progress: 0,
    },
  ];


  return (
    <div className="employee-layout">

      <Sidebar />

      <main className="employee-main">

        <div className="employee-page">

          <div className="page-header">

            <div>

              <h1>
                My Progress 📊
              </h1>

              <p>
                Track your cybersecurity awareness
                and training performance.
              </p>

            </div>

          </div>


          {/* Statistics */}

          <div className="progress-stats">

            <div className="progress-stat-card">

              <span>
                Overall Awareness
              </span>

              <strong>
                82%
              </strong>

              <small>
                Good
              </small>

            </div>


            <div className="progress-stat-card">

              <span>
                Training Progress
              </span>

              <strong>
                76%
              </strong>

              <small>
                4 of 6 courses
              </small>

            </div>


            <div className="progress-stat-card">

              <span>
                Average Quiz Score
              </span>

              <strong>
                {quizScore}%
              </strong>

              <small>
                Latest result
              </small>

            </div>


            <div className="progress-stat-card">

              <span>
                Simulation Score
              </span>

              <strong>
                {simulationScore}%
              </strong>

              <small>
                Latest simulation
              </small>

            </div>

          </div>


          {/* Course Progress */}

          <section className="progress-section">

            <h2>
              Course Progress
            </h2>

            <div className="progress-course-list">

              {courses.map(
                (course, index) => (

                  <div
                    className="progress-course-item"
                    key={index}
                  >

                    <div className="progress-course-header">

                      <strong>
                        {course.name}
                      </strong>

                      <span>
                        {course.progress}%
                      </span>

                    </div>


                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* Activity */}

          <section className="progress-section">

            <h2>
              Assessment Performance
            </h2>

            <div className="assessment-table">

              <div className="assessment-row header">

                <span>
                  Assessment
                </span>

                <span>
                  Type
                </span>

                <span>
                  Score
                </span>

                <span>
                  Status
                </span>

              </div>


              <div className="assessment-row">

                <span>
                  Password Security
                </span>

                <span>
                  Quiz
                </span>

                <span>
                  {quizScore}%
                </span>

                <span className="completed">
                  Completed
                </span>

              </div>


              <div className="assessment-row">

                <span>
                  Phishing Simulation
                </span>

                <span>
                  Simulation
                </span>

                <span>
                  {simulationScore}%
                </span>

                <span className="completed">
                  Completed
                </span>

              </div>

            </div>

          </section>


          <div className="progress-actions">

            <Link
              to="/employee/courses"
              className="primary-button"
            >
              Continue Learning
            </Link>

            <Link
              to="/employee/certificates"
              className="secondary-button"
            >
              View Certificates
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Progress;