import AdminSidebar from "../../Components/Admin/AdminSidebar";
import AdminHeader from "../../Components/Admin/AdminHeader";

function ManageQuizzes() {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main">

        <AdminHeader />

        <section className="dashboard-content">

          <div className="page-title">

            <div>
              <h2>Manage Quizes</h2>

              <p>
                Create and manage cybersecurity
                assessment questions.
              </p>
            </div>

            <button>
              + Add Question
            </button>

          </div>


          <div className="table-card">

            <table>

              <thead>

                <tr>
                  <th>Question</th>
                  <th>Course</th>
                  <th>Difficulty</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>
                    What is phishing?
                  </td>

                  <td>
                    Phishing Awareness
                  </td>

                  <td>
                    Easy
                  </td>

                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>

                <tr>
                  <td>
                    What is ransomware?
                  </td>

                  <td>
                    Malware Awareness
                  </td>

                  <td>
                    Medium
                  </td>

                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ManageQuizzes;