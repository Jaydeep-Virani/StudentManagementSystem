import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { Simple_Button } from "../Components/Simple_Button";

const StudentManage = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term
  useEffect(() => {
    const filtered = students.filter((student) =>
      Object.values(student).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:8081/students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  // Delete student
  const deleteStudent = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8081/delete-student/${id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            fetchStudents();
            Swal.fire({
              title: "Deleted!",
              text: "The student record has been deleted.",
              icon: "success",
              timer: 1000, // Auto-close after 1 second
              showConfirmButton: false,
            });
          } else {
            Swal.fire("Error", "Failed to delete the student.", "error");
          }
        } catch (error) {
          console.error("Error deleting student:", error);
          Swal.fire("Error", "An error occurred while deleting.", "error");
        }
      }
    });
  };
  // Open modal with student data
  const openEditModal = (student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };
  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setStudentToEdit(null);
    setErrors({});
  };
  // Handle student update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append("firstname", studentToEdit.firstname);
        formData.append("lastname", studentToEdit.lastname);
        formData.append("email", studentToEdit.email);
        formData.append("pnumber", studentToEdit.pnumber);
        formData.append("dob", studentToEdit.dob.split("T")[0]);
        formData.append("gender", studentToEdit.gender);

        if (image) {
          formData.append("image", image);
        }

        const response = await fetch(
          `http://localhost:8081/update-student/${studentToEdit.sid}`,
          {
            method: "PUT",
            body: formData, // No need for Content-Type header; browser sets it automatically
          }
        );

        if (response.ok) {
          Swal.fire({
            title: "Success",
            text: "Student details updated successfully.",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });
          fetchStudents();
          closeModal();
        } else {
          const errorData = await response.json();
          Swal.fire(
            "Error",
            errorData.message || "Failed to update student.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error updating student:", error);
        Swal.fire("Error", "An error occurred while updating.", "error");
      }
    }
  };
  // Validate form fields
  const validateForm = () => {
    const validationErrors = {};
    if (!studentToEdit.firstname)
      validationErrors.firstname = "First Name is required";
    if (!studentToEdit.lastname)
      validationErrors.lastname = "Last Name is required";
    if (!studentToEdit.email) validationErrors.email = "Email is required";
    if (!studentToEdit.pnumber)
      validationErrors.pnumber = "Mobile Number is required";
    if (!studentToEdit.dob) validationErrors.dob = "Date of Birth is required";
    if (!studentToEdit.gender) validationErrors.gender = "Gender is required";

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };
  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentToEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };
  const columns = [
    { name: "#", selector: (row, index) => index + 1, sortable: true },
    {
      name: "Profile",
      selector: (row) => row.image,
      cell: (row) => (
        <img
          src={`/StudentImage/${row.image}`} // Ensure correct path
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => (e.target.src = "/default-avatar.png")} // Fallback for missing images
        />
      ),
      sortable: false,
    },
    { name: "First Name", selector: (row) => row.firstname, sortable: true },
    { name: "Last Name", selector: (row) => row.lastname, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Mobile Number", selector: (row) => row.pnumber, sortable: true },
    {
      name: "Date Of Birth",
      selector: (row) => new Date(row.dob).toLocaleDateString("en-CA"),
      sortable: true,
    },
    { name: "Gender", selector: (row) => row.gender, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex space-x-3">
          <button
            onClick={() => openEditModal(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => deleteStudent(row.sid)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "rgb(37, 99, 245)", // Blue-500 in Tailwind
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "14px",
        textAlign: "left",
      },
    },
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          All Students List
        </h2>
      </div>
      <div className="mb-6 flex justify-between items-center">
        <Link to="/add_student">
          <Simple_Button
            linkName="/add_student"
            buttonName="+ Add Student"
            buttonType="button"
          />
        </Link>
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded focus:ring focus:ring-blue-300 focus:outline-sky-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredStudents}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}
        />
      </div>
      {/* Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Edit Student
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="firstname" className="block text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={studentToEdit?.firstname || ""}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded w-full"
                  required
                />
                {errors.firstname && (
                  <p className="text-red-500 text-sm">{errors.firstname}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="lastname" className="block text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={studentToEdit?.lastname || ""}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded w-full"
                  required
                />
                {errors.lastname && (
                  <p className="text-red-500 text-sm">{errors.lastname}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={studentToEdit?.email || ""}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded w-full"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="pnumber" className="block text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="pnumber"
                  name="pnumber"
                  value={studentToEdit?.pnumber || ""}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded w-full"
                  required
                />
                {errors.pnumber && (
                  <p className="text-red-500 text-sm">{errors.pnumber}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="dob" className="block text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={
                    studentToEdit?.dob ? studentToEdit.dob.split("T")[0] : ""
                  }
                  onChange={handleChange}
                  className="px-4 py-2 border rounded w-full"
                  required
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm">{errors.dob}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="gender" className="block text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={studentToEdit?.gender || ""}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded w-full"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700">
                  Profile Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="px-4 py-2 border rounded w-full"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentManage;