import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { Simple_Button } from "../Components/Simple_Button";

const FacultyManage = () => {
  const [faculty, setFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facultyToEdit, setFacultyToEdit] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFaculty();
    fetchSubjects();
  }, []);

  useEffect(() => {
    const filtered = faculty.filter((f) =>
      Object.values(f).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredFaculty(filtered);
  }, [searchTerm, faculty]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch("http://localhost:8081/get_subjects");
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchFaculty = async () => {
    try {
      console.log("Fetching faculty data..."); // Debugging
      const response = await fetch("http://localhost:8081/faculty");

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      console.log("Faculty data received:", data); // Debugging

      setFaculty(data);
    } catch (error) {
      console.error("❌ Fetch Error:", error);
    }
  };
// Delete Faculty
  const deleteFaculty = async (id) => {
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
            `http://localhost:8081/delete-faculty/${id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            fetchFaculty();
            Swal.fire({
              title: "Deleted!",
              text: "The Faculty record has been deleted.",
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFacultyToEdit({ ...facultyToEdit, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (faculty) => {
    setFacultyToEdit({ ...faculty });
    setImagePreview(faculty.image ? `/FacultyImage/${faculty.image}` : "");
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setFacultyToEdit(null);
    setImagePreview("");
  };
  const validateForm = () => {
    const validationErrors = {};

    if (!facultyToEdit?.firstname)
      validationErrors.firstname = "First Name is required";
    if (!facultyToEdit?.lastname)
      validationErrors.lastname = "Last Name is required";
    if (!facultyToEdit?.email) validationErrors.email = "Email is required";
    if (!facultyToEdit?.pnumber)
      validationErrors.pnumber = "Phone Number is required";
    if (!facultyToEdit?.dob) validationErrors.dob = "Date of Birth is required";
    if (!facultyToEdit?.gender) validationErrors.gender = "Gender is required";
    if (!facultyToEdit?.address)
      validationErrors.address = "Address is required";
    if (!facultyToEdit?.subjects)
      validationErrors.subjects = "Subjects are required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; // Returns true if no errors
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formattedDob = new Date(facultyToEdit.dob)
          .toISOString()
          .split("T")[0];

        const formData = new FormData();
        formData.append("firstname", facultyToEdit.firstname);
        formData.append("lastname", facultyToEdit.lastname);
        formData.append("email", facultyToEdit.email);
        formData.append("pnumber", facultyToEdit.pnumber);
        formData.append("dob", formattedDob);
        formData.append("gender", facultyToEdit.gender);
        formData.append("address", facultyToEdit.address);

        // ✅ Send Multiple Selected Subjects as JSON
        formData.append("subject_id", facultyToEdit.subjects);

        // ✅ Process Image Upload
        if (facultyToEdit.image) {
          const file = document.querySelector('input[type="file"]').files[0];
          if (file) {
            const fileExtension = file.name.split(".").pop();
            const formattedFileName = `${facultyToEdit.firstname}_${facultyToEdit.lastname}.${fileExtension}`;
            formData.append("image", file, formattedFileName);
          }
        }

        const response = await fetch(
          `http://localhost:8081/update-faculty/${facultyToEdit.fid}`,
          { method: "PUT", body: formData }
        );

        if (response.ok) {
          Swal.fire("Success", "Faculty details updated.", "success");
          fetchFaculty();
          closeModal();
        } else {
          Swal.fire("Error", "Failed to update faculty.", "error");
        }
      } catch (error) {
        console.error("Error updating faculty:", error);
        Swal.fire("Error", "An error occurred while updating.", "error");
      }
    }
  };

  const columns = [
    { name: "#", selector: (row, index) => index + 1, sortable: true },
    {
      name: "Profile",
      selector: (row) => row.image,
      cell: (row) => (
        <img
          src={`/FacultyImage/${row.image || "default-avatar.png"}`}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => (e.target.src = "/default-avatar.png")}
        />
      ),
      sortable: false,
    },
    {
      name: "First Name",
      selector: (row) => row.firstname || "N/A",
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastname || "N/A",
      sortable: true,
    },
    { name: "Email", selector: (row) => row.email || "N/A", sortable: true },
    {
      name: "Mobile Number",
      selector: (row) => row.pnumber || "N/A",
      sortable: true,
    },
    {
      name: "Date Of Birth",
      selector: (row) => row.dob || "N/A",
      sortable: true,
    },
    { name: "Gender", selector: (row) => row.gender || "N/A", sortable: true },
    {
      name: "Address",
      selector: (row) => row.address || "N/A",
      sortable: true,
    },
    {
      name: "Subjects",
      selector: (row) => row.subjects || "No Subject",
      sortable: true,
    },
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
            onClick={() => deleteFaculty(row.fid)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Faculty Management</h2>
      </div>
      <div className="mb-6 flex justify-between items-center">
        <Link to="/add_faculty">
          <Simple_Button
            linkName="/add_faculty"
            buttonName="+ Add Faculty"
            buttonType="button"
          />
        </Link>
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white shadow-lg rounded-lg">
        <DataTable
          columns={columns}
          data={filteredFaculty}
          pagination
          highlightOnHover
          striped
        />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Faculty</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="First Name"
                value={facultyToEdit?.firstname || ""}
                onChange={(e) =>
                  setFacultyToEdit({
                    ...facultyToEdit,
                    firstname: e.target.value,
                  })
                }
                className="border p-2 w-full mb-2"
              />
              {errors.firstname && (
                <p className="text-red-500 text-sm">{errors.firstname}</p>
              )}
              <input
                type="text"
                placeholder="Last Name"
                value={facultyToEdit?.lastname || ""}
                onChange={(e) =>
                  setFacultyToEdit({
                    ...facultyToEdit,
                    lastname: e.target.value,
                  })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={facultyToEdit?.email || ""}
                onChange={(e) =>
                  setFacultyToEdit({ ...facultyToEdit, email: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={facultyToEdit?.pnumber || ""}
                onChange={(e) =>
                  setFacultyToEdit({
                    ...facultyToEdit,
                    pnumber: e.target.value,
                  })
                }
                className="border p-2 w-full mb-2"
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={
                  facultyToEdit?.dob ? facultyToEdit.dob.split("T")[0] : ""
                }
                onChange={(e) =>
                  setFacultyToEdit({ ...facultyToEdit, dob: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
              <select
                value={facultyToEdit?.gender || ""}
                onChange={(e) =>
                  setFacultyToEdit({ ...facultyToEdit, gender: e.target.value })
                }
                className="border p-2 w-full mb-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Address"
                value={facultyToEdit?.address || ""}
                onChange={(e) =>
                  setFacultyToEdit({
                    ...facultyToEdit,
                    address: e.target.value,
                  })
                }
                className="border p-2 w-full mb-2"
              />
              <select
                multiple
                value={facultyToEdit?.subjects || []} 
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions
                  ).map((option) => option.value);

                  setFacultyToEdit({
                    ...facultyToEdit,
                    subjects: selectedOptions.length > 0 ? selectedOptions : [],
                  });
                }}
                className="border p-2 w-full mb-2"
              >
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
              {/* Image Upload */}
              <div className="mb-2">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-15 h-15 object-cover rounded-full mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManage;
