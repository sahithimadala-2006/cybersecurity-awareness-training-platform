import AdminSidebar from "../../Components/Admin/AdminSidebar";
import AdminHeader from "../../Components/Admin/AdminHeader";

function ManageSimulations() {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main">

        <AdminHeader />

        <section className="dashboard-content">

          <div className="page-title">

            <div>

              <h2>
                Manage Simulations
              </h2>

              <p>
                Create realistic cybersecurity
                scenarios for employees.
              </p>

            </div>

            <button>
              + Create Simulation
            </button>

          </div>


          <div className="simulation-grid">

            <div className="simulation-card">

              <h3>
                Phishing Email Simulation
              </h3>

              <p>
                Employees identify whether an
                email is legitimate or malicious.
              </p>

              <span>
                Difficulty: Easy
              </span>

              <div>
                <button>Edit</button>
                <button>Delete</button>
              </div>

            </div>


            <div className="simulation-card">

              <h3>
                Social Engineering Call
              </h3>

              <p>
                Employees respond to a simulated
                social engineering scenario.
              </p>

              <span>
                Difficulty: Medium
              </span>

              <div>
                <button>Edit</button>
                <button>Delete</button>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ManageSimulations;