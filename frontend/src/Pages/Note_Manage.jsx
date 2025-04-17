import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import Submit_Button from "../Components/Submit_Button";
import axios from "axios";

const ManageNote = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: null, content: "" });

  const [role, setRole] = useState("");
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8081/master", {
        withCredentials: true,
      });

      const userData = res.data.data;
      const userRole = res.data.role;

      if (userData) {
        setRole(userRole);
      }
    } catch (err) {
      console.error("❌ Error fetching profile data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch notes from backend
  const fetchNotes = () => {
    fetch("http://localhost:8081/get-notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err));
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  // Validation schema
  const validationSchema = Yup.object({
    noteContent: Yup.string().required("Please Enter Note Content"),
  });
  // Add note form
  const formik = useFormik({
    initialValues: {
      noteContent: "",
    },
    validationSchema,
    onSubmit: (values) => {
      fetch("http://localhost:8081/add-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note_content: values.noteContent }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              title: "Success!",
              text: "New Note Successfully Added",
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
              timerProgressBar: true,
            }).then(() => {
              formik.resetForm();
              fetchNotes();
            });
          } else {
            Swal.fire("Error!", "Failed to add note.", "error");
          }
        })
        .catch(() => {
          Swal.fire("Error!", "Something went wrong.", "error");
        });
    },
  });
  // Open Edit Modal
  const openEditModal = (note) => {
    setCurrentNote({ id: note.nid, content: note.notes });
    setIsModalOpen(true);
  };
  // Update note
  const handleUpdateNote = () => {
    if (!currentNote.content.trim()) {
      Swal.fire("Validation Error", "Note content is required", "warning");
      return;
    }

    fetch(`http://localhost:8081/update-note/${currentNote.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note_content: currentNote.content }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({
            title: "Updated!",
            text: "Note has been updated.",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
          fetchNotes();
          setIsModalOpen(false);
        } else {
          Swal.fire("Error!", "Failed to update note.", "error");
        }
      })
      .catch(() => Swal.fire("Error!", "Something went wrong.", "error"));
  };
  // Delete note
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this note?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8081/delete-note/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              Swal.fire({
                title: "Deleted!",
                text: "Note has been deleted.",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
                timerProgressBar: true,
              });
              fetchNotes();
            } else {
              Swal.fire("Error!", "Failed to delete note.", "error");
            }
          })
          .catch(() => {
            Swal.fire("Error!", "Something went wrong.", "error");
          });
      }
    });
  };
  return (
    <div className="p-6 flex flex-row max-w-full justify-between gap-6">
      {(role == 1 || role == 3) && (
        <>
          {/* Add Note Form */}
          <div className="bg-white shadow-md rounded-lg p-6 w-1/2 h-80">
            <h2 className="text-xl font-bold mb-4">Add Note</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Note Content
                </label>
                <textarea
                  name="noteContent"
                  className="mt-1 p-2 border rounded w-full focus:outline-sky-500"
                  rows="4"
                  {...formik.getFieldProps("noteContent")}
                ></textarea>
                {formik.touched.noteContent && formik.errors.noteContent && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.noteContent}
                  </span>
                )}
              </div>
              <Submit_Button buttonType="submit" buttonName="+ Add Notes" />
            </form>
          </div>
        </>
      )}
      {/* Note List */}
      <div className="bg-white shadow-md rounded-lg p-6 w-1/2">
        <h2 className="text-xl font-bold mb-4">Note List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-600">
                <th className="px-4 py-2 text-white">Sr No.</th>
                <th className="px-4 py-2 text-white">Note Content</th>
                {(role == 1 || role == 3) && (
                  <>
                    <th className="px-4 py-2 text-white">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {notes.length > 0 ? (
                notes.map((note, index) => (
                  <tr key={note.note_id}>
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2 text-center">{note.notes}</td>
                    {(role == 1 || role == 3) && (
                      <>
                        <td className="px-4 py-2 text-center space-x-4">
                          <button
                            onClick={() => openEditModal(note)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(note.nid)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No notes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Note</h2>
            <textarea
              rows="4"
              className="w-full border rounded p-2 focus:outline-sky-500"
              value={currentNote.content}
              onChange={(e) =>
                setCurrentNote({ ...currentNote, content: e.target.value })
              }
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNote}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNote;
