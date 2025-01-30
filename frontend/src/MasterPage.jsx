import { useState } from "react";
import PropTypes from "prop-types";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaTachometerAlt } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { BsDot } from "react-icons/bs";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

const MasterPage = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [studentSubmenuOpen, setStudentSubmenuOpen] = useState(false);
  const [facultySubmenuOpen, setFacultySubmenuOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleStudentSubmenu = () => setStudentSubmenuOpen(!studentSubmenuOpen);
  const toggleFacultySubmenu = () => setFacultySubmenuOpen(!facultySubmenuOpen);

  return (
    <div className="h-screen flex flex-col bg-white text-black">
      {/* Navbar */}
      <nav className="p-4 fixed w-full z-10 flex items-center justify-between bg-blue-600 text-white">
        <div className="flex items-center">
          <Link to={'/dashboard'}>
          <img src="./Logo/IMG_1599.PNG" alt="" className="ml-4 w-[200px]" />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={toggleDropdown} className="bg-dark-500 p-2 rounded text-white flex items-center">
              <img src="https://via.placeholder.com/150" className="w-8 h-8 mr-3 rounded-full" />
              Virani Jaydeep
              <IoMdArrowDropdown className="ml-2 w-5 h-5" />
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                <li className="px-4 py-2 hover:font-bold ">
                  <Link to="/settings">Settings</Link>
                </li>
                <li className="px-4 py-2 hover:font-bold">
                  <Link to="/logout">Logout</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* Layout Below Navbar */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className={`mt-5 transition-transform duration-300 ${sidebarOpen ? "w-64" : "w-16"} bg-white shadow-lg flex flex-col h-full relative`}>
          <button onClick={toggleSidebar} className="text-black p-2 pl-4" aria-label="Toggle Sidebar">
            <GiHamburgerMenu className="w-6 h-6" />
          </button>
          <ul className="flex-1 w-full">
            <li className="flex items-center py-4 px-4 hover:font-bold hover:scale-106">
              <FaTachometerAlt className="w-5 h-5" />
              {sidebarOpen && <Link to="/dashboard" className="ml-4">Dashboard</Link>}
            </li>

            {/* Student Submenu */}
            <li className="py-4 px-4 hover:font-bold hover:scale-106 cursor-pointer flex items-center" onClick={toggleStudentSubmenu}>
              <FaUsersLine className="w-5 h-5" />
              {sidebarOpen && <span className="ml-4">Student</span>}
              {sidebarOpen && (studentSubmenuOpen ? <IoMdArrowDropdown className="ml-auto" /> : <IoMdArrowDropright className="ml-auto" />)}
            </li>
            {studentSubmenuOpen && (
              <ul className={`transition-all duration-300 ${sidebarOpen ? "ml-10 bg-white p-2 rounded" : "absolute left-16 w-48 bg-white shadow-lg p-2 rounded"}`}>
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
            <li className="py-4 px-4 hover:font-bold hover:scale-106 cursor-pointer flex items-center" onClick={toggleFacultySubmenu}>
              <FaUsersLine className="w-5 h-5" />
              {sidebarOpen && <span className="ml-4">Faculty</span>}
              {sidebarOpen && (facultySubmenuOpen ? <IoMdArrowDropdown className="ml-auto" /> : <IoMdArrowDropright className="ml-auto" />)}
            </li>
            {facultySubmenuOpen && (
              <ul className={`transition-all duration-300 ${sidebarOpen ? "ml-10 bg-white p-2 rounded" : "absolute left-16 w-48 bg-white shadow-lg p-2 rounded"}`}>
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
          </ul>

          <ul>
            <li className="flex items-center py-4 px-4 mb-4 hover:font-bold hover:scale-106">
              <RiLogoutBoxRLine className="w-6 h-6" />
              {sidebarOpen && <Link to="/logout" className="ml-4">Logout</Link>}
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">{children}</div>
          <footer className="p-4 bg-white text-black">
            <p className="text-center">Footer Content</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

MasterPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MasterPage;