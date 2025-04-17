import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaTachometerAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { BsDot } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GiNotebook } from "react-icons/gi";
import { SiGoogleclassroom } from "react-icons/si";
import { CgNotes } from "react-icons/cg";
import { AiFillRead } from "react-icons/ai";
import { FaOutdent } from "react-icons/fa";
import { PiNotebookFill } from "react-icons/pi";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import axios from "axios";
export const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [studentSubmenuOpen, setStudentSubmenuOpen] = useState(false);
  const [facultySubmenuOpen, setFacultySubmenuOpen] = useState(false);
  const [materialSubmenuOpen, setMaterialSubmenuOpen] = useState(false);
  const [holidaySubmenuOpen, setHolidaySubmenuOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleStudentSubmenu = () => setStudentSubmenuOpen(!studentSubmenuOpen);
  const toggleFacultySubmenu = () => setFacultySubmenuOpen(!facultySubmenuOpen);
  const toggleMaterialSubmenu = () =>
    setMaterialSubmenuOpen(!materialSubmenuOpen);
  const toggleHolidaySubmenu = () => setHolidaySubmenuOpen(!holidaySubmenuOpen);

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

  return (
    <>
      <div
        className={`mt-5 transition-transform duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg flex flex-col h-full relative`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-black p-2 pl-4"
          aria-label="Toggle Sidebar"
        >
          <GiHamburgerMenu className="w-6 h-6" />
        </button>
        <ul className="flex-1 w-full">
          {/* Dashboard */}
          <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
            <FaTachometerAlt className="w-5 h-5" />
            {sidebarOpen && (
              <Link to="/dashboard" className="ml-4">
                Dashboard
              </Link>
            )}
          </li>
          {/* Student Submenu */}
          {(role === 1 || role === 3) && (
            <>
              <li
                className="py-4 px-4 hover:font-bold hover:scale-106 cursor-pointer flex items-center"
                onClick={toggleStudentSubmenu}
              >
                <FaUsers className="w-5 h-5" />
                {sidebarOpen && <span className="ml-4">Student</span>}
                {sidebarOpen &&
                  (studentSubmenuOpen ? (
                    <IoMdArrowDropdown className="ml-auto" />
                  ) : (
                    <IoMdArrowDropright className="ml-auto" />
                  ))}
              </li>

              {studentSubmenuOpen && (
                <ul
                  className={`transition-all duration-300 ${
                    sidebarOpen
                      ? "ml-10 bg-white p-2 rounded"
                      : "absolute left-16 w-48 bg-white shadow-lg p-2 rounded"
                  }`}
                >
                  <li className="py-2 flex items-center hover:font-bold hover:scale-106">
                    <BsDot className="w-5 h-5 mr-2" />
                    <Link to="/add_student">Add Student</Link>
                  </li>
                  <li className="py-2 flex items-center hover:font-bold hover:scale-106">
                    <BsDot className="w-5 h-5 mr-2" />
                    <Link to="/student_manage">Manage Students</Link>
                  </li>
                </ul>
              )}
            </>
          )}
          {/* Faculty Submenu */}
          {role === 1 && (
            <>
              <li
                className="py-4 px-4 hover:font-bold hover:scale-106 cursor-pointer flex items-center"
                onClick={toggleFacultySubmenu}
              >
                <FaUsers className="w-5 h-5" />
                {sidebarOpen && <span className="ml-4">Faculty</span>}
                {sidebarOpen &&
                  (facultySubmenuOpen ? (
                    <IoMdArrowDropdown className="ml-auto" />
                  ) : (
                    <IoMdArrowDropright className="ml-auto" />
                  ))}
              </li>
              {facultySubmenuOpen && (
                <ul
                  className={`transition-all duration-300 ${
                    sidebarOpen
                      ? "ml-10 bg-white p-2 rounded"
                      : "absolute left-16 w-48 bg-white shadow-lg p-2 rounded"
                  }`}
                >
                  <li className="py-2 flex items-center hover:font-bold hover:scale-106">
                    <BsDot className="w-5 h-5 mr-2" />
                    <Link to="/add_faculty">Add Faculty</Link>
                  </li>
                  <li className="py-2 flex items-center hover:font-bold hover:scale-106">
                    <BsDot className="w-5 h-5 mr-2" />
                    <Link to="/faculty_manage">Manage Faculty</Link>
                  </li>
                </ul>
              )}
            </>
          )}
          {/* Material Submenu */}
          {(role === 1 || role === 3) && (
            <>
              <li
                className="py-4 px-4 hover:font-bold hover:scale-106 cursor-pointer flex items-center"
                onClick={toggleMaterialSubmenu}
              >
                <AiFillRead className="w-5 h-5" />
                {sidebarOpen && <span className="ml-4">Material</span>}
                {sidebarOpen &&
                  (materialSubmenuOpen ? (
                    <IoMdArrowDropdown className="ml-auto" />
                  ) : (
                    <IoMdArrowDropright className="ml-auto" />
                  ))}
              </li>
              {materialSubmenuOpen && (
                <ul
                  className={`transition-all duration-300 ${
                    sidebarOpen
                      ? "ml-10 bg-white p-2 rounded"
                      : "absolute left-16 w-48 bg-white shadow-lg p-2 rounded"
                  }`}
                >
                  <li className="py-2 flex items-center hover:font-bold hover:scale-106">
                    <BsDot className="w-5 h-5 mr-2" />
                    <Link to="/add_material">Add Material</Link>
                  </li>
                  <li className="py-2 flex items-center hover:font-bold hover:scale-106">
                    <BsDot className="w-5 h-5 mr-2" />
                    <Link to="/materials">All Material</Link>
                  </li>
                </ul>
              )}
            </>
          )}

          {/* Student Material */}
          {role === 4 && (
            <>
              <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
                <AiFillRead className="w-5 h-5" />
                {sidebarOpen && (
                  <Link to="/materials" className="ml-4">
                    All Material
                  </Link>
                )}
              </li>
            </>
          )}

          {/* Holiday Submenu */}
          {(role === 1 || role === 3) && (
            <>
              <li
                className="py-4 px-4 hover:font-bold hover:scale-106 cursor-pointer flex items-center"
                onClick={toggleHolidaySubmenu}
              >
                <FaCalendarAlt className="w-5 h-5" />
                {sidebarOpen && <span className="ml-4">Holiday</span>}
                {sidebarOpen &&
                  (holidaySubmenuOpen ? (
                    <IoMdArrowDropdown className="ml-auto" />
                  ) : (
                    <IoMdArrowDropright className="ml-auto" />
                  ))}
              </li>
              {holidaySubmenuOpen && (
                <ul
                  className={`transition-all duration-300 ${
                    sidebarOpen
                      ? "ml-10 bg-white p-2 rounded"
                      : "absolute left-16 w-48 bg-white shadow-lg p-2 rounded"
                  }`}
                >
                  <li className="py-2 flex items-center hover:font-bold hover:scale-106">
                    <BsDot className="w-5 h-5 mr-2" />
                    <Link to="/add_holiday">Add Holiday</Link>
                  </li>
                  <li className="py-2 flex items-center hover:font-bold hover:scale-106">
                    <BsDot className="w-5 h-5 mr-2" />
                    <Link to="/holiday">Manage Holiday</Link>
                  </li>
                </ul>
              )}
            </>
          )}

          {/* Student Holiday */}
          {role === 4 && (
            <>
              <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
                <FaCalendarAlt className="w-5 h-5" />
                {sidebarOpen && (
                  <Link to="/holiday" className="ml-4">
                    Holiday
                  </Link>
                )}
              </li>
            </>
          )}

          {/* Manage Class */}
          {(role === 1 || role === 3) && (
            <>
              <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
                <SiGoogleclassroom className="w-5 h-5" />
                {sidebarOpen && (
                  <Link to="/class_manage" className="ml-4">
                    Manage Class
                  </Link>
                )}
              </li>
            </>
          )}
          {/* Manage Subject */}
          {(role === 1 || role === 3) && (
            <>
              <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
                <PiNotebookFill className="w-5 h-5" />
                {sidebarOpen && (
                  <Link to="/subject_manage" className="ml-4">
                    Manage Subject
                  </Link>
                )}
              </li>
            </>
          )}
          {/* Manage Note */}
          {(role === 1 || role === 3) && (
            <>
              <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
                <GiNotebook className="w-5 h-5" />
                {sidebarOpen && (
                  <Link to="/note_manage" className="ml-4">
                    Manage Note
                  </Link>
                )}
              </li>
            </>
          )}

          {/* Leave Manage */}

          {(role === 1 || role === 3 || role === 4) && (
            <>
              <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
                <CgNotes className="w-5 h-5" />
                {sidebarOpen && (
                  <Link to="/leave_manage" className="ml-4">
                    Leave Manage
                  </Link>
                )}
              </li>
            </>
          )}

          {/* Add Leave */}
          {(role === 4 || role === 3) && (
            <>
              <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
                <FaOutdent className="w-5 h-5" />
                {sidebarOpen && (
                  <Link to="/add_leave" className="ml-4">
                    Add Leave
                  </Link>
                )}
              </li>
            </>
          )}
        </ul>
        {/* Logout */}
        <ul>
          <li className="flex items-center py-4 px-4 mb-4 hover:font-bold hover:scale-106">
            <RiLogoutBoxRLine className="w-6 h-6" />
            {sidebarOpen && (
              <Link to="/logout" className="ml-4">
                Logout
              </Link>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};
