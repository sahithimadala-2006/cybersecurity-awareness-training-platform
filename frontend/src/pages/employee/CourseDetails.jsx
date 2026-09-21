import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function CourseDetails() {

  const lessons = [
    {
      title: "Introduction to Phishing",
      duration: "8 min",
      completed: true,
    },

    {
      title: "Types of Phishing Attacks",
      duration: "10 min",
      completed: true,
    },

    {
      title: "Identifying Suspicious Emails",
      duration: "12 min",
      completed: true,
    },

    {
      title: "Phishing Indicators",
      duration: "10 min",
      completed: false,
    },

    {
      title: "Phishing Prevention",
      duration: "8 min",
      completed: false,
    },

    {
      title: "Final Assessment",
      duration: "10 questions",
      completed: false,
    },
  ];

  return (
    <div className="employee-layout">

      <Sidebar />

      <main className="employee-main">

        <div className="employee-page">

          <Link
            to="/employee/courses"
            className="back-link"
          >
            ← Back to Courses
          </Link>


          <div className="course-detail-header">

            <div className="large-course-icon">
              🎣
            </div>

            <div>

              <span className="course-category">
                Email Security
              </span>

              <h1>
                Phishing Awareness
              </h1>

              <p>
                Learn how to identify phishing emails,
                suspicious links and common phishing
                techniques.
              </p>

            </div>

          </div>


          {/* Progress */}
          <div className="detail-progress-card">

            <div className="progress-label">

              <span>
                Course Progress
              </span>

              <strong>
                80%
              </strong>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{ width: "80%" }}
              />

            </div>

          </div>


          {/* Lessons */}
          <section className="detail-section">

            <h2>
              Course Lessons
            </h2>

            <div className="lesson-list">

              {lessons.map(
                (lesson, index) => (

                  <div
                    className="lesson-item"
                    key={index}
                  >

                    <div className="lesson-number">
                      {lesson.completed
                        ? "✓"
                        : index + 1}
                    </div>

                    <div className="lesson-info">

                      <h3>
                        {lesson.title}
                      </h3>

                      <span>
                        {lesson.duration}
                      </span>

                    </div>

                    <button
                      className={
                        lesson.completed
                          ? "lesson-completed"
                          : "lesson-button"
                      }
                    >
                      {lesson.completed
                        ? "Completed"
                        : "Start"}
                    </button>

                  </div>

                )
              )}

            </div>

          </section>


          {/* Learning Objectives */}
          <section className="detail-section">

            <h2>
              Learning Objectives
            </h2>

            <div className="objective-grid">

              <div>
                ✓ Identify phishing emails
              </div>

              <div>
                ✓ Detect suspicious URLs
              </div>

              <div>
                ✓ Recognize social engineering
              </div>

              <div>
                ✓ Protect account credentials
              </div>

            </div>

          </section>


          <div className="detail-actions">

            <Link
              to="/employee/quiz"
              className="primary-button"
            >
              Take Course Quiz →
            </Link>

            <Link
              to="/employee/simulation"
              className="secondary-button"
            >
              Try Phishing Simulation
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default CourseDetails;