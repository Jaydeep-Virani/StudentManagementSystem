import { FiDownload, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { useEffect, useState } from "react";

const Material = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userSession, setUserSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Check User Session
  const checkSession = async () => {
    try {
      const response = await axios.get("http://localhost:8081/session", {
        withCredentials: true,
      });
      setUserSession(response.data.user);
    } catch (error) {
      console.error("No Active Session:", error.response?.data || error);
      setUserSession(null);
    }
  };

  // ✅ Fetch Materials
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/materials", {
        withCredentials: true,
      });
      setData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      console.error("Error fetching Material:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await checkSession();
      await fetchMaterials();
    };
    loadData();
  }, []);

  // 🔍 Handle Search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = data.filter((material) => {
      const term = value.toLowerCase();
      return (
        material.subject?.toLowerCase().includes(term) ||
        material.material_title?.toLowerCase().includes(term) ||
        material.chapter?.toLowerCase().includes(term)
      );
    });

    setFilteredData(filtered);
  };

  // ✅ Download Handler
  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/download/${fileName}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // ✅ Delete Handler
  const handleDelete = async (materialId) => {
    try {
      await axios.delete(`http://localhost:8081/material/${materialId}`);
      const updatedData = data.filter(
        (material) => material.material_id !== materialId
      );
      setData(updatedData);
      setFilteredData(
        updatedData.filter((material) =>
          material.subject?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className="p-6">
      {/* 🔍 Search Bar */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by Subject, Title or Chapter..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded focus:ring focus:ring-blue-300 focus:outline-none focus:border-sky-600 w-full max-w-sm transition-all duration-300 hover:shadow-md"
        />
      </div>

      {/* 📚 Material Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          // 🌀 Skeleton Loader
          [...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse w-full h-48 rounded-lg"
            ></div>
          ))
        ) : filteredData.length > 0 ? (
          filteredData.map((material) => (
            <div
              key={material.material_id}
              className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
            >
              {/* 📝 File Preview */}
              <div
                className={`w-24 h-24 rounded-lg flex items-center justify-center mb-4 ${
                  material.material_file?.toLowerCase().endsWith(".pdf")
                    ? "bg-red-100"
                    : material.material_file?.toLowerCase().endsWith(".doc") ||
                      material.material_file?.toLowerCase().endsWith(".docx")
                    ? "bg-blue-100"
                    : "bg-gray-100"
                }`}
              >
                {material.material_file && (
                  <>
                    {material.material_file.toLowerCase().endsWith(".pdf") ? (
                      <img src="pdf.jpg" alt="PDF" className="w-12 h-12" />
                    ) : material.material_file.toLowerCase().endsWith(".doc") ||
                      material.material_file.toLowerCase().endsWith(".docx") ? (
                      <img src="doc.jpg" alt="Word" className="w-12 h-12" />
                    ) : (
                      <span className="text-xs text-gray-600">Unknown</span>
                    )}
                  </>
                )}
              </div>
              {/* 📖 Title & Chapter */}
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                {material.material_title}
              </h3>
              <p className="text-gray-600 text-sm">{material.chapter}</p>

              {/* ⚡ Action Buttons */}
              <div className="flex space-x-4 mt-4">
                {/* Download Button */}
                <button
                  className="relative group p-3 text-blue-500 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                  title="Download"
                  onClick={() => handleDownload(material.material_file)}
                >
                  <FiDownload
                    size={22}
                    className="transition-colors duration-300 group-hover:text-white"
                  />
                </button>

                {/* Delete Button */}
                {(userSession?.role === 1 ||
                  userSession?.role === 2 ||
                  userSession?.role === 3) && (
                  <button
                    className="relative group p-3 text-red-500 border border-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                    title="Delete"
                    onClick={() => handleDelete(material.material_id)}
                  >
                    <FiTrash2
                      size={22}
                      className="transition-colors duration-300 group-hover:text-white"
                    />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-12 text-gray-500">
            <img
              src="/empty-box.png"
              alt="No Data"
              className="w-24 h-24 mb-4 animate-bounce-slow"
            />
            <p className="text-lg font-medium">Oops! No materials found.</p>
            <p className="text-sm">
              Try adjusting your search or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Material;
