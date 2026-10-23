import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function QuizResult() {
  const score =
    Number(localStorage.getItem("quizScore")) || 0;

  const totalQuestions =
    Number(localStorage.getItem("quizTotal")) || 5;

  const correctAnswers = Math.round(
    (score / 100) * totalQuestions
  );

  const questionsToReview =
    totalQuestions - correctAnswers;

  const getMessage = () => {
    if (score >= 80) {
      return "Excellent cybersecurity awareness!";
    }

    if (score >= 60) {
      return "Good performance. Keep improving!";
    }

    return "Review the course material and try again.";
  };

  return (
    <div className="employee-layout">
      <Sidebar />

      <main className="employee-main">
        <div className="result-container">

          <div className="result-card">

            {/* Result Icon */}
            <div className="result-icon">
              {score >= 80 ? "🎉" : "📚"}
            </div>

            <h1>Quiz Completed!</h1>

            <p>{getMessage()}</p>

            {/* Score Circle */}
            <div className="score-circle">
              <strong>{score}%</strong>
              <span>Score</span>
            </div>

            {/* Result Statistics */}
            <div className="result-stats">

              <div>
                <strong>{correctAnswers}</strong>
                <span>
                  Correct
                </span>
              </div>

              <div>
                <strong>{questionsToReview}</strong>
                <span>
                  To Review
                </span>
              </div>

            </div>

            {/* Total Questions */}
            <p className="result-total">
              You answered {correctAnswers} out of{" "}
              {totalQuestions} questions correctly.
            </p>

            {/* Actions */}
            <div className="result-actions">

              <Link
                to="/employee/quiz"
                className="primary-button"
              >
                Retake Quiz
              </Link>

              <Link
                to="/employee/progress"
                className="secondary-button"
              >
                View My Progress
              </Link>

            </div>

            {/* Dashboard */}
            <Link
              to="/employee/dashboard"
              className="back-link"
            >
              ← Back to Dashboard
            </Link>

          </div>

        </div>
      </main>
    </div>
  );
}

export default QuizResult;