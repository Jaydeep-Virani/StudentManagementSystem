import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Submit_Button from "../Components/Submit_Button";

const API_URL = "http://localhost:8081";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false); // 🔹 Modal state

  // ✅ Fetch All Classes
  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_classes`);
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // ✅ Formik for Add/Edit Class
  const formik = useFormik({
    initialValues: { className: "" },
    validationSchema: Yup.object({
      className: Yup.string().required("Class Name Is Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editId) {
          // 🔹 Update Class API Call
          await axios.put(`${API_URL}/update_class/${editId}`, values);
          Swal.fire({
            title: "Updated!",
            text: "Class updated successfully",
            icon: "success",
            timer: 1000, 
            showConfirmButton: false, 
            timerProgressBar: true,
          });
          setEditId(null);
        } else {
          // 🔹 Add Class API Call
          await axios.post(`${API_URL}/add_class`, values);
          Swal.fire({
            title: "Success!",
            text: "Class added successfully",
            icon: "success",
            timer: 1000,
            showConfirmButton: false, 
            timerProgressBar: true,
          });
        }
        resetForm();
        fetchClasses();
        setShowModal(false); // 🔹 Close modal after update
      } catch (error) {
        console.error("Error saving class:", error);
        Swal.fire("Error!", "Failed to save class", "error");
      }
    },
  });

  // ✅ Delete Class
  const deleteClass = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/delete_class/${id}`);
          fetchClasses();
          Swal.fire({
            title: "Deleted!",
            text: "Class has been deleted.",
            icon: "success",
            timer: 1000, 
            showConfirmButton: false, 
            timerProgressBar: true,
          });
        } catch (error) {
          console.error("Error deleting class:", error);
          Swal.fire("Error!", "Failed to delete class", "error");
        }
      }
    });
  };

  return (
    <div className="p-6 flex flex-row max-w-full justify-between gap-6">
      {/* ✅ Left Side: Add/Edit Class Form */}
      <div className="bg-white shadow-md rounded-lg p-6 w-1/2 h-60">
        <h2 className="text-xl font-bold mb-4">Add Class</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Class Name</label>
            <input
              type="text"
              name="className"
              className="mt-1 p-2 border rounded w-full focus:outline-sky-500"
              {...formik.getFieldProps("className")}
            />
            {formik.touched.className && formik.errors.className && (
              <span className="text-red-500 text-sm">{formik.errors.className}</span>
            )}
          </div>
          < Submit_Button buttonType="submit" buttonName="Add Class" />
        </form>
      </div>

      {/* ✅ Right Side: Class List Table */}
      <div className="bg-white shadow-md rounded-lg p-6 w-1/2">
        <h2 className="text-xl font-bold mb-4">Class List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-600">
                <th className="px-4 py-2 text-white">Sr No.</th>
                <th className="px-4 py-2 text-white">Class Name</th>
                <th className="px-4 py-2 text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr key={cls.class_id} className="border-t border-gray-300">
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-center">{cls.class_name}</td>
                  <td className="px-4 py-2 space-x-2 text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setEditId(cls.class_id);
                        formik.setValues({ className: cls.class_name });
                        setShowModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => deleteClass(cls.class_id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal for Editing */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg w-110">
            <h2 className="text-xl font-bold mb-4">Update Class</h2>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label className="block text-sm font-medium">Class Name</label>
                <input
                  type="text"
                  name="className"
                  className="mt-1 p-2 border rounded w-full focus:outline-sky-500"
                  {...formik.getFieldProps("className")}
                />
                {formik.touched.className && formik.errors.className && (
                  <span className="text-red-500 text-sm">{formik.errors.className}</span>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

export default Class;
