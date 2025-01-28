import { useState } from "react";
import PropTypes from "prop-types";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import { FaTachometerAlt } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";

const MasterPage = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const sidebarClass = "bg-white text-black shadow-lg";

  return (
    <div className="h-screen flex flex-col bg-white text-black">
      {/* Navbar */}
      <nav className="p-4 fixed w-full z-10 flex items-center justify-between bg-blue-600 text-white">
        <div className="flex items-center">
          <span className="ml-4 text-xl font-semibold">Navbar</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-dark-500 p-2 rounded text-white flex items-center"
            >
              <img
                src="https://via.placeholder.com/150"
                className="w-8 h-8 mr-3 rounded-full"
              />
              Virani Jaydeep
              <IoMdArrowDropdown className="ml-2 w-5 h-5" />
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                <li className="px-4 py-2 cursor-pointer hover:scale-106 hover:font-bold">
                  <Link to="/settings">Settings</Link>
                </li>
                <li className="px-4 py-2 cursor-pointer hover:scale-106 hover:font-bold">
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
        <div
          className={`mt-5 transition-transform duration-300 ${
            sidebarOpen ? "w-64" : "w-16"
          } ${sidebarClass} flex flex-col h-full`}
        >
          <button
            onClick={toggleSidebar}
            className="text-black p-2 py-4 px-4"
            aria-label="Toggle Sidebar"
            aria-expanded={sidebarOpen}
          >
            <GiHamburgerMenu className="w-6 h-6" />
          </button>
          <ul className="flex-1 w-full mt-3">
            <li className="flex items-center py-4 px-4 hover:scale-106 hover:font-bold">
              <FaTachometerAlt className="w-5 h-5"/>
              {sidebarOpen && (
                <Link to="/dashboard" className="ml-4">
                  Dashboard
                </Link>
              )}
            </li>
            <li className="flex items-center py-4 px-4 hover:scale-106 hover:font-bold">
              <IoPersonAddSharp  className="w-5 h-5" />
              {sidebarOpen && (
                <Link to="/student_manage" className="ml-4">
                  Add Student
                </Link>
              )}
            </li>
            <li className="flex items-center py-4 px-4 hover:scale-106 hover:font-bold">
              <IoPersonAddSharp  className="w-5 h-5" />
              {sidebarOpen && (
                <Link to="/faculty_manage" className="ml-4">
                  Add Faculty
                </Link>
              )}
            </li>
          </ul>
          <ul>
            <li className="flex items-center py-4 px-4 mb-4 hover:scale-106 hover:font-bold">
              <IoIosLogOut className="w-6 h-6" />
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
