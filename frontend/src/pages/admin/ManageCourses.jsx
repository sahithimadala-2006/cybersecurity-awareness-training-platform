import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

function ManageCourses() {

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Phishing Awareness",
      category: "Phishing",
      difficulty: "Beginner",
      duration: "30 minutes",
      status: "Published",
      description:
        "Learn how to identify phishing emails, suspicious links, and fraudulent messages.",
    },
    {
      id: 2,
      title: "Malware Awareness",
      category: "Malware",
      difficulty: "Intermediate",
      duration: "40 minutes",
      status: "Published",
      description:
        "Understand different types of malware and how to protect organizational systems.",
    },
    {
      id: 3,
      title: "Social Engineering",
      category: "Social Engineering",
      difficulty: "Intermediate",
      duration: "35 minutes",
      status: "Published",
      description:
        "Learn how attackers manipulate people to obtain confidential information.",
    },
    {
      id: 4,
      title: "Password Security",
      category: "Password Security",
      difficulty: "Beginner",
      duration: "20 minutes",
      status: "Draft",
      description:
        "Learn how to create strong passwords and protect your accounts.",
    },
  ]);


  const [showForm, setShowForm] = useState(false);

  const [editingCourse, setEditingCourse] = useState(null);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");


  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "",
    difficulty: "",
    duration: "",
    description: "",
  });


  /* ========================================
     FORM INPUT
  ======================================== */

  const handleChange = (e) => {

    setCourseForm({
      ...courseForm,
      [e.target.name]: e.target.value,
    });

  };


  /* ========================================
     ADD / UPDATE COURSE
  ======================================== */

  const handleSubmit = (e) => {

    e.preventDefault();


    if (editingCourse) {

      setCourses(
        courses.map((course) =>
          course.id === editingCourse.id
            ? {
                ...course,
                ...courseForm,
              }
            : course
        )
      );

      setEditingCourse(null);

    } else {

      const newCourse = {
        id: Date.now(),
        title: courseForm.title,
        category: courseForm.category,
        difficulty: courseForm.difficulty,
        duration: courseForm.duration,
        description: courseForm.description,
        status: "Draft",
      };

      setCourses([
        ...courses,
        newCourse,
      ]);

    }


    setCourseForm({
      title: "",
      category: "",
      difficulty: "",
      duration: "",
      description: "",
    });

    setShowForm(false);

  };


  /* ========================================
     EDIT COURSE
  ======================================== */

  const handleEdit = (course) => {

    setEditingCourse(course);

    setCourseForm({
      title: course.title,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      description: course.description,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* ========================================
     DELETE COURSE
  ======================================== */

  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    setCourses(
      courses.filter(
        (course) => course.id !== id
      )
    );

  };


  /* ========================================
     PUBLISH / UNPUBLISH
  ======================================== */

  const toggleStatus = (id) => {

    setCourses(
      courses.map((course) => {

        if (course.id === id) {

          return {
            ...course,
            status:
              course.status === "Published"
                ? "Draft"
                : "Published",
          };

        }

        return course;

      })
    );

  };


  /* ========================================
     CANCEL FORM
  ======================================== */

  const handleCancel = () => {

    setShowForm(false);

    setEditingCourse(null);

    setCourseForm({
      title: "",
      category: "",
      difficulty: "",
      duration: "",
      description: "",
    });

  };


  /* ========================================
     SEARCH + FILTER
  ======================================== */

  const filteredCourses = courses.filter(
    (course) => {

      const matchesSearch =
        course.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(search.toLowerCase());


      const matchesCategory =
        categoryFilter === "All" ||
        course.category === categoryFilter;


      return (
        matchesSearch &&
        matchesCategory
      );

    }
  );


  /* ========================================
     STATISTICS
  ======================================== */

  const totalCourses = courses.length;

  const publishedCourses =
    courses.filter(
      (course) =>
        course.status === "Published"
    ).length;

  const draftCourses =
    courses.filter(
      (course) =>
        course.status === "Draft"
    ).length;


  return (

    <div className="admin-layout">

      {/* SIDEBAR */}

      <AdminSidebar />


      {/* MAIN AREA */}

      <main className="admin-main">

        <AdminHeader />


        <div className="dashboard-content">


          {/* PAGE TITLE */}

          <div className="page-title">

            <div>

              <h2>
                Course Management
              </h2>

              <p>
                Create and manage cybersecurity
                awareness training courses.
              </p>

            </div>


            <button
              onClick={() => {

                if (showForm) {
                  handleCancel();
                } else {
                  setShowForm(true);
                }

              }}
            >

              {showForm
                ? "Cancel"
                : "+ Add Course"}

            </button>

          </div>


          {/* ========================================
              STATISTICS
          ======================================== */}

          <div className="stats-grid">

            <div className="stat-card">

              <h3>
                Total Courses
              </h3>

              <div className="stat-number">
                {totalCourses}
              </div>

              <span>
                All training courses
              </span>

            </div>


            <div className="stat-card">

              <h3>
                Published
              </h3>

              <div className="stat-number">
                {publishedCourses}
              </div>

              <span>
                Available to employees
              </span>

            </div>


            <div className="stat-card">

              <h3>
                Drafts
              </h3>

              <div className="stat-number">
                {draftCourses}
              </div>

              <span>
                Unpublished courses
              </span>

            </div>


            <div className="stat-card">

              <h3>
                Categories
              </h3>

              <div className="stat-number">
                4
              </div>

              <span>
                Security topics
              </span>

            </div>

          </div>


          {/* ========================================
              ADD / EDIT FORM
          ======================================== */}

          {showForm && (

            <div className="form-card">

              <h3>

                {editingCourse
                  ? "Edit Course"
                  : "Create New Course"}

              </h3>


              <form onSubmit={handleSubmit}>


                {/* TITLE */}

                <div className="form-group">

                  <label>
                    Course Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={courseForm.title}
                    onChange={handleChange}
                    placeholder="Example: Phishing Awareness"
                    required
                  />

                </div>


                {/* CATEGORY */}

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={courseForm.category}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Category
                    </option>

                    <option value="Phishing">
                      Phishing
                    </option>

                    <option value="Malware">
                      Malware
                    </option>

                    <option value="Social Engineering">
                      Social Engineering
                    </option>

                    <option value="Password Security">
                      Password Security
                    </option>

                  </select>

                </div>


                {/* DIFFICULTY */}

                <div className="form-group">

                  <label>
                    Difficulty
                  </label>

                  <select
                    name="difficulty"
                    value={courseForm.difficulty}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Difficulty
                    </option>

                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>

                  </select>

                </div>


                {/* DURATION */}

                <div className="form-group">

                  <label>
                    Duration
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleChange}
                    placeholder="Example: 30 minutes"
                    required
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="form-group">

                  <label>
                    Course Description
                  </label>

                  <textarea
                    name="description"
                    value={courseForm.description}
                    onChange={handleChange}
                    placeholder="Enter course description"
                    rows="4"
                    required
                  />

                </div>


                {/* BUTTONS */}

                <div className="form-buttons">

                  <button type="submit">

                    {editingCourse
                      ? "Update Course"
                      : "Create Course"}

                  </button>


                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>

          )}


          {/* ========================================
              SEARCH + FILTER
          ======================================== */}

          <div className="course-controls">

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />


            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >

              <option value="All">
                All Categories
              </option>

              <option value="Phishing">
                Phishing
              </option>

              <option value="Malware">
                Malware
              </option>

              <option value="Social Engineering">
                Social Engineering
              </option>

              <option value="Password Security">
                Password Security
              </option>

            </select>

          </div>


          {/* ========================================
              COURSE LIST
          ======================================== */}

          <div className="course-management-grid">

            {filteredCourses.map(
              (course) => (

                <div
                  className="management-course-card"
                  key={course.id}
                >


                  <div className="course-card-top">

                    <span className="course-category">

                      {course.category}

                    </span>


                    <span
                      className={
                        course.status === "Published"
                          ? "status completed"
                          : "status progress"
                      }
                    >

                      {course.status}

                    </span>

                  </div>


                  <h3>
                    {course.title}
                  </h3>


                  <p>
                    {course.description}
                  </p>


                  <div className="course-details">

                    <span>
                      📊 {course.difficulty}
                    </span>

                    <span>
                      ⏱ {course.duration}
                    </span>

                  </div>


                  <div className="course-actions">

                    <button
                      onClick={() =>
                        handleEdit(course)
                      }
                    >
                      Edit
                    </button>


                    <button
                      onClick={() =>
                        toggleStatus(course.id)
                      }
                    >

                      {course.status === "Published"
                        ? "Unpublish"
                        : "Publish"}

                    </button>


                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(course.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )}

          </div>


          {/* NO RESULTS */}

          {filteredCourses.length === 0 && (

            <div className="empty-state">

              <h3>
                No courses found
              </h3>

              <p>
                Try changing your search or
                category filter.
              </p>

            </div>

          )}

        </div>

      </main>

    </div>

  );
}

export default ManageCourses;