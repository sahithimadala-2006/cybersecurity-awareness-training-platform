import AdminSidebar from "../../Components/Admin/AdminSidebar";
import AdminHeader from "../../Components/Admin/AdminHeader";

function Reports() {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main">

        <AdminHeader />

        <section className="dashboard-content">

          <div className="page-title">

            <div>

              <h2>
                Training Reports
              </h2>

              <p>
                Monitor employee training performance.
              </p>

            </div>

            <button>
              Export Report
            </button>

          </div>


          <div className="stats-grid">

            <div className="stat-card">
              <h3>Average Score</h3>
              <p className="stat-number">
                82%
              </p>
            </div>

            <div className="stat-card">
              <h3>Completion Rate</h3>
              <p className="stat-number">
                76%
              </p>
            </div>

            <div className="stat-card">
              <h3>Simulation Success</h3>
              <p className="stat-number">
                71%
              </p>
            </div>

          </div>


          <div className="table-card">

            <table>

              <thead>

                <tr>
                  <th>Employee</th>
                  <th>Quiz Score</th>
                  <th>Simulation</th>
                  <th>Course Progress</th>
                  <th>Overall</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>Pavani</td>
                  <td>85%</td>
                  <td>90%</td>
                  <td>82%</td>
                  <td>86%</td>
                </tr>

                <tr>
                  <td>Sahithi</td>
                  <td>72%</td>
                  <td>65%</td>
                  <td>68%</td>
                  <td>68%</td>
                </tr>

                <tr>
                  <td>Chaitanya</td>
                  <td>94%</td>
                  <td>88%</td>
                  <td>91%</td>
                  <td>91%</td>
                </tr>

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Reports;