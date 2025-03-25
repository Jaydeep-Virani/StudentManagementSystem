import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const NotFound = () => {
  const [glitch, setGlitch] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch((prev) => (prev + 1) % 3);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
      <div className="relative text-9xl font-bold flex">
        <span className={`absolute text-black ${glitch === 1 ? "-translate-x-2" : ""} ${glitch === 2 ? "translate-x-2" : ""} transition-transform duration-200`}>
          4
        </span>
        <span className={`text-black ${glitch === 2 ? "-translate-x-2" : ""} ${glitch === 1 ? "translate-x-2" : ""} transition-transform duration-200`}>
          0
        </span>
        <span className={`absolute text-black ${glitch === 1 ? "translate-x-2" : ""} ${glitch === 2 ? "-translate-x-2" : ""} transition-transform duration-200`}>
          4
        </span>
      </div>
      <p className="mt-4 text-2xl opacity-0 animate-fadeIn">Page Not Found</p>
      <Link to="/" className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-transform hover:scale-105">
        Go to Home
      </Link>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 1.5s ease-in-out forwards; }
        `}
      </style>
    </div>
  );
};

export default NotFound;
