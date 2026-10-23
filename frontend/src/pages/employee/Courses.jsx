import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function Courses() {

  const courses = [
    {
      id: 1,
      title: "Phishing Awareness",
      description:
        "Learn how to identify phishing emails, suspicious links and common phishing techniques.",
      category: "Email Security",
      progress: 80,
      level: "Beginner",
      icon: "🎣",
    },

    {
      id: 2,
      title: "Password Security",
      description:
        "Learn how to create strong passwords and protect your accounts.",
      category: "Account Security",
      progress: 100,
      level: "Beginner",
      icon: "🔐",
    },

    {
      id: 3,
      title: "Social Engineering",
      description:
        "Understand social engineering attacks and how attackers manipulate users.",
      category: "Human Security",
      progress: 60,
      level: "Intermediate",
      icon: "🎭",
    },

    {
      id: 4,
      title: "Malware Awareness",
      description:
        "Understand malware types, infection methods and prevention techniques.",
      category: "Malware",
      progress: 40,
      level: "Intermediate",
      icon: "🦠",
    },

    {
      id: 5,
      title: "Safe Internet Practices",
      description:
        "Learn safe browsing, downloads and online security practices.",
      category: "Online Safety",
      progress: 20,
      level: "Beginner",
      icon: "🌐",
    },

    {
      id: 6,
      title: "Data Protection",
      description:
        "Learn how to protect sensitive organizational and personal information.",
      category: "Data Security",
      progress: 0,
      level: "Advanced",
      icon: "🛡️",
    },
  ];

  return (
    <div className="employee-layout">

      <Sidebar />

      <main className="employee-main">

        <div className="employee-page">

          <div className="page-header">

            <div>
              <h1>Cybersecurity Courses 📚</h1>

              <p>
                Improve your cybersecurity knowledge through
                interactive training modules.
              </p>
            </div>

          </div>


          <div className="course-grid">

            {courses.map((course) => (

              <div
                className="course-card"
                key={course.id}
              >

                <div className="course-icon">
                  {course.icon}
                </div>

                <div className="course-category">
                  {course.category}
                </div>

                <h2>
                  {course.title}
                </h2>

                <p>
                  {course.description}
                </p>


                <div className="course-info">

                  <span>
                    Level: {course.level}
                  </span>

                  <span>
                    {course.progress}% Complete
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


                <Link
                  to="/employee/course-details"
                  className="course-button"
                >
                  {course.progress === 100
                    ? "Review Course"
                    : course.progress > 0
                    ? "Continue"
                    : "Start Course"}
                </Link>

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Courses;