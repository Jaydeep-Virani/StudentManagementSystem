import { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
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
import { FaUser, FaCog, FaSignOutAlt, FaKey, FaLock } from "react-icons/fa";

const MasterPage = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [studentSubmenuOpen, setStudentSubmenuOpen] = useState(false);
  const [facultySubmenuOpen, setFacultySubmenuOpen] = useState(false);
  const [materialSubmenuOpen, setMaterialSubmenuOpen] = useState(false);
  const [holidaySubmenuOpen, setHolidaySubmenuOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");
  const correctPassword = "admin123"; // Change this to integrate with authentication logic

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const toggleStudentSubmenu = () => setStudentSubmenuOpen(!studentSubmenuOpen);
  const toggleFacultySubmenu = () => setFacultySubmenuOpen(!facultySubmenuOpen);
  const toggleMaterialSubmenu = () => setMaterialSubmenuOpen(!materialSubmenuOpen);
  const toggleHolidaySubmenu = () => setHolidaySubmenuOpen(!holidaySubmenuOpen);

  const handleLockScreen = () => setIsLocked(true);
  const handleUnlock = () => {
    if (password === correctPassword) {
      setIsLocked(false);
      setPassword("");
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incorrect Password",
        confirmButtonText: "Try Again",
        position: "top", // Aligns the alert at the top of the screen
        toast: false, // Use a regular modal (not a toast)
        showConfirmButton: true,
        timer: 5000, // Optional: auto-close the alert after a delay (in milliseconds)
        customClass: {
          popup: "top-10 w-[500px] h-[300px]", // Increase width and height of the alert
        },
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white text-black">
      {/* Navbar */}
      <nav className="p-4 fixed w-full z-10 flex items-center justify-between bg-blue-600 text-white">
        <div className="flex items-center">
          <Link to={"/dashboard"}>
            <img src="./Logo/IMG_1599.PNG" alt="" className="ml-4 w-[200px]" />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-dark-500 p-2 rounded text-white flex items-center"
            >
              <img src="profile.png" className="w-8 h-8 mr-3 rounded-full" />
              Virani Jaydeep
              <IoMdArrowDropdown className="ml-2 w-5 h-5" />
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                <li className="px-4 py-2 flex items-center gap-2 hover:font-bold hover:scale-102">
                  <FaUser className="w-4 h-4" />
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="px-4 py-2 flex items-center gap-2 hover:font-bold border-gray-300 hover:scale-102">
                  <FaKey className="w-4 h-4" />
                  <Link to="/change_password">Change Password</Link>
                </li>
                <li className="px-4 py-2 flex items-center gap-2 hover:font-bold hover:scale-102">
                  <FaLock className="w-4 h-4" />
                  <button onClick={handleLockScreen}>Lock Screen</button>
                </li>
                <li className="px-4 py-2 flex items-center gap-2 hover:font-bold border-b border-gray-300 hover:scale-102">
                  <FaCog className="w-4 h-4" />
                  <Link to="/settings">Settings</Link>
                </li>
                <li className="px-4 py-2 flex items-center gap-2 hover:font-bold hover:scale-102">
                  <FaSignOutAlt className="w-4 h-4" />
                  <Link to="/logout">Logout</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Lock Screen Modal */}
      {isLocked && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white z-50">
          <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 text-black p-8 rounded-lg shadow-2xl w-96">
            <h2 className="text-xl font-bold mb-4 text-center text-white">
              Screen Locked
            </h2>
            <input
              type="password"
              className="border p-3 w-full font-bold text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white px-8 py-4 rounded-lg w-full transform transition duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:border-4 hover:border-white active:scale-95 active:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              onClick={handleUnlock}
            >
              Unlock
            </button>
          </div>
        </div>
      )}

      {/* Layout Below Navbar */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div
          className={`mt-5 transition-transform duration-300 ${
            sidebarOpen ? "w-64" : "w-16"
          } bg-white shadow-lg flex flex-col h-full relative`}
        >
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

            {/* Faculty Submenu */}
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

            {/* Material Submenu */}
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

            {/* Holiday Submenu */}
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
                  <Link to="/holiday">Add Holiday</Link>
                </li>
                <li className="py-2 flex items-center hover:font-bold hover:scale-106">
                  <BsDot className="w-5 h-5 mr-2" />
                  <Link to="/student_manage">Manage Holiday</Link>
                </li>
              </ul>
            )}

            {/* Manage Class */}
            <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
              <SiGoogleclassroom className="w-5 h-5" />
              {sidebarOpen && (
                <Link to="/class_manage" className="ml-4">
                  Manage Class
                </Link>
              )}
            </li>

            {/* Manage Subject */}
            <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
              <PiNotebookFill className="w-5 h-5" />
              {sidebarOpen && (
                <Link to="/subject_manage" className="ml-4">
                  Manage Subject
                </Link>
              )}
            </li>

            {/* Manage Note */}
            <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
              <GiNotebook className="w-5 h-5" />
              {sidebarOpen && (
                <Link to="/note_manage" className="ml-4">
                  Manage Note
                </Link>
              )}
            </li>


            {/* Add Leave */}
            <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
              <CgNotes className="w-5 h-5" />
              {sidebarOpen && (
                <Link to="/leave_manage" className="ml-4">
                  Leave Manage
                </Link>
              )}
            </li>

            {/* Leave Manage */}
            <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
              <FaOutdent className="w-5 h-5" />
              {sidebarOpen && (
                <Link to="/add_leave" className="ml-4">
                  Add Leave
                </Link>
              )}
            </li>
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">{children}</div>
          {/* <footer className="p-4 bg-white text-black">
            <p className="text-center">Footer Content</p>
          </footer> */}
        </div>
      </div>
    </div>
  );
};

MasterPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MasterPage;
