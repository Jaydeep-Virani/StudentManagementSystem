import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProtectedRoute = ({ element, allowedRoles, userRole }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (userRole === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-blue-100">
        <div className="text-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 border-solid mx-auto mb-4 shadow-lg shadow-blue-300"></div>
                <motion.p
                  className="text-blue-700 text-lg font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Checking permissions...
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="unauthorized"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              >
                <div className="rounded-full h-14 w-14 bg-red-600 mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-red-300 animate-bounce">
                  !
                </div>
                <motion.p
                  className="text-red-600 text-xl font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Unauthorized access
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
          <MdLockOutline className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600 mt-2">
            You do not have permission to view this page.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex items-center justify-center gap-2 bg-red-500 text-white px-5 py-3 w-full rounded-full shadow-md hover:bg-red-600 transition-all"
          >
            <FaArrowLeft className="text-lg" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return element;
};

export default ProtectedRoute;
