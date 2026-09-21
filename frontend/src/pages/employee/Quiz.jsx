import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function Quiz() {
  const navigate = useNavigate();

  const questions = [
    {
      question:
        "Which of the following is a common sign of a phishing email?",
      options: [
        "Urgent request for credentials",
        "Normal company announcement",
        "Regular newsletter",
        "Known internal message",
      ],
      answer: 0,
    },

    {
      question:
        "What should you do if you receive a suspicious link?",
      options: [
        "Click it immediately",
        "Forward it to everyone",
        "Verify the link before opening it",
        "Enter your password",
      ],
      answer: 2,
    },

    {
      question:
        "Which information should never be shared through an untrusted email?",
      options: [
        "Public company information",
        "Password and OTP",
        "Office location",
        "Public website URL",
      ],
      answer: 1,
    },

    {
      question:
        "What is phishing mainly designed to do?",
      options: [
        "Improve network speed",
        "Steal sensitive information",
        "Update software",
        "Create backups",
      ],
      answer: 1,
    },

    {
      question:
        "Which URL should make you suspicious?",
      options: [
        "https://company.com",
        "https://mail.company.com",
        "https://company-security-login.xyz",
        "https://support.company.com",
      ],
      answer: 2,
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);

  const question = questions[currentQuestion];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer.");
      return;
    }

    const updatedAnswers = [
      ...answers,
      selectedAnswer,
    ];

    setAnswers(updatedAnswers);

    // Move to next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      return;
    }

    // Calculate final score
    let score = 0;

    updatedAnswers.forEach((answer, index) => {
      if (answer === questions[index].answer) {
        score++;
      }
    });

    const percentage = Math.round(
      (score / questions.length) * 100
    );

    // Save quiz information
    localStorage.setItem("quizScore", percentage);
    localStorage.setItem(
      "quizTotal",
      questions.length
    );

    // Navigate to result page
    navigate("/employee/quiz-result");
  };

  return (
    <div className="employee-layout">
      <Sidebar />

      <main className="employee-main">
        <div className="quiz-container">

          {/* Quiz Header */}
          <div className="quiz-header">
            <span>
              Cybersecurity Awareness Quiz
            </span>

            <span>
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </span>
          </div>

          {/* Quiz Progress */}
          <div className="quiz-progress">
            <div
              className="quiz-progress-fill"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>

          {/* Question Card */}
          <div className="quiz-card">

            <h1>{question.question}</h1>

            {/* Options */}
            <div className="quiz-options">
              {question.options.map(
                (option, index) => (
                  <button
                    key={index}
                    type="button"
                    className={
                      selectedAnswer === index
                        ? "quiz-option selected"
                        : "quiz-option"
                    }
                    onClick={() =>
                      handleAnswer(index)
                    }
                  >
                    <span className="option-letter">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span>{option}</span>
                  </button>
                )
              )}
            </div>

            {/* Next / Submit */}
            <button
              type="button"
              className="primary-button quiz-next"
              onClick={handleNext}
            >
              {currentQuestion ===
              questions.length - 1
                ? "Submit Quiz"
                : "Next Question →"}
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Quiz;