import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaKey, FaLock } from "react-icons/fa";
import { IoMdArrowDropdown} from "react-icons/io";
import Swal from "sweetalert2";

export const  Navbar = () =>{
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [password, setPassword] = useState("");
    const correctPassword = "admin123";

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    
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
                    className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white px-8 py-4 rounded-lg w-full transform transition duration-300 ease-in-out hover:scale-102 hover:shadow-2xl hover:border-4 hover:border-white active:scale-95 active:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                    onClick={handleUnlock}
                    >
                    Unlock
                    </button>
                </div>
                </div>
            )}
        </>
    );
} 