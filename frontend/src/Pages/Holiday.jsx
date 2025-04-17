import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { LuPlus } from "react-icons/lu";
import { FaCalendarDays } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";
const Holiday = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
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

  // GetMonth
  useEffect(() => {
    fetch("http://localhost:8081/get-months")
      .then((res) => res.json())
      .then((data) => {
        setMonths(data);

        const currentMonthName = new Date().toLocaleString("default", {
          month: "long",
        });
        const found = data.find(
          (m) => m.monthname.toLowerCase() === currentMonthName.toLowerCase()
        );

        if (found) {
          setSelectedMonth(found.monthname);
        } else if (data.length > 0) {
          setSelectedMonth(data[0].monthname);
        }
      })
      .catch((err) => {
        console.error("Error fetching months:", err);
      });
  }, []);

  // GetHolidays
  useEffect(() => {
    if (selectedMonth) {
      fetch(`http://localhost:8081/get-holidays?monthname=${selectedMonth}`)
        .then((res) => res.json())
        .then((data) => setHolidays(data))
        .catch((err) => {
          console.error("Error fetching holidays:", err);
        });
    }
  }, [selectedMonth]);

  const fetchHolidays = () => {
    fetch(`http://localhost:8081/get-holidays?monthname=${selectedMonth}`)
      .then((res) => res.json())
      .then((data) => setHolidays(data))
      .catch((err) => console.error("Error refetching holidays:", err));
  };

  const handleEditClick = (holiday) => {
    setSelectedHoliday(holiday);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    fetch(`http://localhost:8081/update-holiday/${selectedHoliday.hid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedHoliday),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Holiday updated successfully!");
          setShowEditModal(false);
          setSelectedHoliday(null);
          fetchHolidays();
        } else {
          toast.error("Failed to update holiday.");
        }
      })
      .catch((err) => {
        console.error("Error updating holiday:", err);
        toast.error("Something went wrong!");
      });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleDelete = (holidayId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this holiday?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8081/delete-holiday/${holidayId}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              Swal.fire("Deleted!", "Holiday has been deleted.", "success");
              fetchHolidays(); // Refresh the list
            } else {
              Swal.fire("Failed!", "Could not delete the holiday.", "error");
            }
          })
          .catch((err) => {
            console.error("Error deleting holiday:", err);
            Swal.fire("Error!", "Something went wrong.", "error");
          });
      }
    });
  };

  return (
    <div className="p-6">
      <Link to="/add_holiday" className="inline-block mb-4">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 hover:scale-104 transition">
          <LuPlus className="w-5 h-5" /> Add Holiday
        </button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold border-b pb-2">Months</h3>
          <ul className="mt-2 space-y-2">
            {months.map((month) => (
              <button
                key={month.mid}
                onClick={() => setSelectedMonth(month.monthname)}
                className={`block w-full text-left px-4 py-2 rounded-md transition ${
                  selectedMonth === month.monthname
                    ? "bg-blue-600 text-white hover:scale-102"
                    : "bg-gray-100 hover:bg-gray-200 hover:scale-102"
                }`}
              >
                {month.monthname}
              </button>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-lg overflow-auto">
          <div className="text-lg font-semibold border-b pb-2 flex items-center space-x-4">
            <FaCalendarDays className="w-5 h-5" />
            <span>{selectedMonth}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mt-2 border border-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Sr No.</th>
                  <th className="px-4 py-2 text-left">Holiday Name</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  {(role === 1 ||role === 3) && (
                    <>
                      <th className="px-4 py-2">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday, index) => (
                  <tr key={holiday.hid} className="border-b border-gray-200">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{holiday.holiday_name}</td>
                    <td className="px-4 py-2">{holiday.holiday_date}</td>
                    {(role === 1 || role === 3) && (
                      <>
                        <td className="px-4 py-2 flex justify-center gap-4">
                          <button
                            onClick={() => handleEditClick(holiday)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(holiday.hid)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <MdDelete className="w-5 h-5" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      {showEditModal && selectedHoliday && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Edit Holiday</h2>
            <label className="block mb-2">Holiday Name</label>
            <input
              className="w-full px-3 py-2 border rounded mb-4"
              type="text"
              value={selectedHoliday.holiday_name}
              onChange={(e) =>
                setSelectedHoliday({
                  ...selectedHoliday,
                  holiday_name: e.target.value,
                })
              }
            />
            <label className="block mb-2">Holiday Date</label>
            <input
              className="w-full px-3 py-2 border rounded mb-4"
              type="date"
              value={formatDateForInput(selectedHoliday.holiday_date)}
              onChange={(e) =>
                setSelectedHoliday({
                  ...selectedHoliday,
                  holiday_date: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default Holiday;
