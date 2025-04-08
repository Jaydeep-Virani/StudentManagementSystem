import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaKey, FaLock } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import axios from "axios";
import { motion } from "framer-motion";

export const Navbar = () => {
  const [lockPassword, setLockPassword] = useState(null);
  const checkPassword = async () => {
    try {
      const response = await axios.get("http://localhost:8081/password", {
        withCredentials: true,
      });
      setLockPassword(response.data.user.password); // ✅ Correct access
    } catch (error) {
      console.error("No Active Session:", error.response?.data || error);
      setLockPassword(null);
    }
  };

  useEffect(() => {
    checkPassword();
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(() => {
    const savedLock = localStorage.getItem("isLocked");
    return savedLock === "true";
  });
  const [password, setPassword] = useState("");
  const correctPassword = lockPassword;
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLockScreen = () => {
    setIsLocked(true);
    localStorage.setItem("isLocked", "true");
  };

  const handleUnlock = () => {
    if (password === correctPassword) {
      setIsLocked(false);
      localStorage.setItem("isLocked", "false");
      setPassword("");
      setError(""); // Clear any previous error
    } else {
      setError("Incorrect password. Please try again.");
    }
  };
  return (
    <>
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
                {/* <li className="px-4 py-2 flex items-center gap-2 hover:font-bold border-b border-gray-300 hover:scale-102">
                        <FaCog className="w-4 h-4" />
                        <Link to="/settings">Settings</Link>
                        </li> */}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 50, scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-8 w-[90%] max-w-md shadow-2xl text-center transition-all duration-500 text-white"
          >
            <div className="mb-4 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-white/90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c1.656 0 3-1.344 3-3V5a3 3 0 00-6 0v3c0 1.656 1.344 3 3 3zm6 2H6a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold mb-2">Screen Locked</h2>

            <p className="text-sm text-white/70 mb-6">
              Enter your password to unlock the screen
            </p>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
            />
            {error && (
              <p className="text-sm text-red-400 mb-4 font-medium transition duration-300 animate-shake">
                {error}
              </p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 text-white font-medium shadow-lg hover:shadow-2xl transition-all duration-300"
              onClick={handleUnlock}
            >
              Unlock
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
