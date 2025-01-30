import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";

const FacultyManage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const facultys = [
    { id: 1, profile: "https://via.placeholder.com/40", name: "Tiger Nixon", education: "M.COM, P.H.D.", mobile: "123 456 7890", email: "info@example.com", admissionDate: "2011/04/25" },
    { id: 2, profile: "https://via.placeholder.com/40", name: "Garrett Winters", education: "M.COM, P.H.D.", mobile: "987 654 3210", email: "info@example.com", admissionDate: "2011/07/25" },
    { id: 3, profile: "https://via.placeholder.com/40", name: "Ashton Cox", education: "B.COM, M.COM.", mobile: "(123) 4567 890", email: "info@example.com", admissionDate: "2009/01/12" }
  ];

  const filteredFacultys = facultys.filter(faculty =>
    Object.values(faculty).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <div className="mb-4 mt-3 flex justify-between">
        <h2 className="text-2xl font-semibold">All Faculty List</h2>
      </div>
      <div className="mb-4 flex justify-between">
        <Link to="/add_faculty">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500 transition duration-300">
            + Add Faculty
          </button>
        </Link>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Search..." 
            className="px-4 py-2 border rounded shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Profile</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Roll No.</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Education</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Mobile</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Admission Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacultys.map((faculty, index) => (
              <tr key={faculty.id} className="bg-gray-100 transition duration-300">
                <td className="border border-gray-300 px-4 py-2"><img src={faculty.profile} alt="Profile" className="rounded-full w-10 h-10" /></td>
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{faculty.name}</td>
                <td className="border border-gray-300 px-4 py-2">{faculty.education}</td>
                <td className="border border-gray-300 px-4 py-2">{faculty.mobile}</td>
                <td className="border border-gray-300 px-4 py-2">{faculty.email}</td>
                <td className="border border-gray-300 px-4 py-2">{faculty.admissionDate}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                  <button className="text-red-600 hover:text-red-700"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FacultyManage;