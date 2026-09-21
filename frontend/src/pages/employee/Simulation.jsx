import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function Simulation() {

  const [selected, setSelected] =
    useState(null);

  const [completed, setCompleted] =
    useState(false);


  const handleChoice = (choice) => {

    setSelected(choice);
    setCompleted(true);

    const score =
      choice === "phishing"
        ? 100
        : 0;

    localStorage.setItem(
      "simulationScore",
      score
    );

  };


  return (
    <div className="employee-layout">

      <Sidebar />

      <main className="employee-main">

        <div className="simulation-container">

          <div className="page-header">

            <div>

              <h1>
                Phishing Simulation 🎯
              </h1>

              <p>
                Practice identifying suspicious
                emails in a safe environment.
              </p>

            </div>

          </div>


          {!completed ? (

            <div className="email-simulation-card">

              <div className="email-header">

                <div>
                  📧
                </div>

                <div>

                  <strong>
                    Security Alert
                  </strong>

                  <span>
                    simulation@security-alert.com
                  </span>

                </div>

              </div>


              <div className="email-content">

                <p>
                  <strong>
                    Subject:
                  </strong>{" "}
                  Urgent: Your account will be
                  suspended
                </p>

                <hr />

                <p>
                  Dear Employee,
                </p>

                <p>
                  We detected unusual activity
                  on your account.
                </p>

                <p>
                  Your account will be suspended
                  within 24 hours unless you verify
                  your account immediately.
                </p>

                <button className="fake-link">
                  Verify My Account
                </button>

                <p>
                  Thank you,
                  <br />
                  IT Security Team
                </p>

              </div>


              <div className="simulation-question">

                <h2>
                  What would you do?
                </h2>

                <p>
                  Analyze the email carefully
                  before making a decision.
                </p>


                <div className="simulation-actions">

                  <button
                    className="simulation-danger"
                    onClick={() =>
                      handleChoice("phishing")
                    }
                  >
                    🚨 Report Phishing
                  </button>


                  <button
                    className="simulation-safe"
                    onClick={() =>
                      handleChoice("safe")
                    }
                  >
                    ✓ Mark as Safe
                  </button>

                </div>

              </div>

            </div>

          ) : (

            <div className="simulation-result">

              {selected === "phishing" ? (

                <>
                  <div className="success-icon">
                    ✓
                  </div>

                  <h1>
                    Correct! 🎉
                  </h1>

                  <p>
                    You correctly identified
                    this message as a phishing
                    attempt.
                  </p>

                  <div className="indicator-box">

                    <h3>
                      Phishing Indicators
                    </h3>

                    <ul>

                      <li>
                        Urgent request
                      </li>

                      <li>
                        Suspicious sender
                      </li>

                      <li>
                        Threat of account suspension
                      </li>

                      <li>
                        Request to verify account
                      </li>

                    </ul>

                  </div>
                </>

              ) : (

                <>
                  <div className="warning-icon">
                    ⚠️
                  </div>

                  <h1>
                    Be Careful!
                  </h1>

                  <p>
                    This email contains several
                    indicators of a phishing attack.
                  </p>

                  <div className="indicator-box">

                    <h3>
                      Remember
                    </h3>

                    <p>
                      Always verify the sender,
                      inspect links and avoid
                      responding to urgent requests
                      for sensitive information.
                    </p>

                  </div>

                </>

              )}


              <div className="result-actions">

                <button
                  className="primary-button"
                  onClick={() => {
                    setSelected(null);
                    setCompleted(false);
                  }}
                >
                  Try Again
                </button>

                <Link
                  to="/employee/progress"
                  className="secondary-button"
                >
                  View Progress
                </Link>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default Simulation;