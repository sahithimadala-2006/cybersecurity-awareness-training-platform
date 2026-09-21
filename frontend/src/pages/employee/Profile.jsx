import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function Profile() {

  const [editing, setEditing] =
    useState(false);


  const [profile, setProfile] =
    useState({
      name: "Rahul",
      employeeId: "EMP001",
      department: "CSE",
      email: "rahul@cybersafe.com",
      phone: "+91 98765 43210",
      role: "Employee",
      securityLevel: "Intermediate",
    });


  const handleChange = (event) => {

    setProfile({
      ...profile,
      [event.target.name]:
        event.target.value,
    });

  };


  const handleSave = () => {

    setEditing(false);

    alert(
      "Profile updated successfully!"
    );

  };


  return (
    <div className="employee-layout">

      <Sidebar />

      <main className="employee-main">

        <div className="employee-page">

          <div className="page-header">

            <div>

              <h1>
                My Profile 👤
              </h1>

              <p>
                View and manage your employee
                profile information.
              </p>

            </div>


            <button
              className="primary-button"
              onClick={() =>
                editing
                  ? handleSave()
                  : setEditing(true)
              }
            >
              {editing
                ? "Save Changes"
                : "Edit Profile"}
            </button>

          </div>


          <div className="profile-container">

            <div className="profile-header">

              <div className="profile-avatar">
                R
              </div>

              <div>

                <h2>
                  {profile.name}
                </h2>

                <p>
                  {profile.role}
                </p>

                <span className="security-badge">
                  🛡️ {profile.securityLevel}
                </span>

              </div>

            </div>


            <div className="profile-grid">

              <div className="profile-field">

                <label>
                  Full Name
                </label>

                {editing ? (

                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />

                ) : (

                  <p>
                    {profile.name}
                  </p>

                )}

              </div>


              <div className="profile-field">

                <label>
                  Employee ID
                </label>

                <p>
                  {profile.employeeId}
                </p>

              </div>


              <div className="profile-field">

                <label>
                  Department
                </label>

                {editing ? (

                  <input
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                  />

                ) : (

                  <p>
                    {profile.department}
                  </p>

                )}

              </div>


              <div className="profile-field">

                <label>
                  Email
                </label>

                {editing ? (

                  <input
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />

                ) : (

                  <p>
                    {profile.email}
                  </p>

                )}

              </div>


              <div className="profile-field">

                <label>
                  Phone
                </label>

                {editing ? (

                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />

                ) : (

                  <p>
                    {profile.phone}
                  </p>

                )}

              </div>


              <div className="profile-field">

                <label>
                  Security Level
                </label>

                <p>
                  {profile.securityLevel}
                </p>

              </div>

            </div>

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

export default Profile;