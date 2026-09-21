import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function Certificates() {

  const certificates = [
    {
      title: "Cybersecurity Awareness",
      date: "18 September 2026",
      score: "90%",
      icon: "🏆",
    },

    {
      title: "Password Security",
      date: "15 September 2026",
      score: "85%",
      icon: "🔐",
    },

    {
      title: "Phishing Awareness",
      date: "10 September 2026",
      score: "90%",
      icon: "🎣",
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
                My Certificates 🏆
              </h1>

              <p>
                Certificates earned through your
                cybersecurity training.
              </p>

            </div>

          </div>


          <div className="certificate-grid">

            {certificates.map(
              (certificate, index) => (

                <div
                  className="certificate-card"
                  key={index}
                >

                  <div className="certificate-icon">
                    {certificate.icon}
                  </div>

                  <h2>
                    {certificate.title}
                  </h2>

                  <p>
                    Successfully completed
                    cybersecurity training.
                  </p>

                  <div className="certificate-details">

                    <span>
                      Completed
                    </span>

                    <strong>
                      {certificate.date}
                    </strong>

                  </div>

                  <div className="certificate-score">

                    Score:{" "}
                    <strong>
                      {certificate.score}
                    </strong>

                  </div>


                  <button
                    className="primary-button"
                    onClick={() =>
                      alert(
                        "Certificate preview will be available in the final version."
                      )
                    }
                  >
                    View Certificate
                  </button>

                </div>

              )
            )}

          </div>


          <div className="certificate-note">

            <span>
              💡
            </span>

            <p>
              Complete more cybersecurity courses
              and assessments to earn additional
              certificates.
            </p>

          </div>


          <Link
            to="/employee/dashboard"
            className="back-link"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </main>

    </div>
  );
}

export default Certificates;