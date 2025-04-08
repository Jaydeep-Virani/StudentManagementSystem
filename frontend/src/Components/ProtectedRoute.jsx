import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
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
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 border border-blue-100 p-10 rounded-3xl shadow-lg max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="mb-5"
          >
            <MdLockOutline className="text-blue-500 text-6xl mx-auto animate-pulse" />
          </motion.div>

          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            Access Denied
          </h2>
          <p className="text-blue-500 text-sm mb-6">
            Sorry, you don’t have the necessary permissions to access this page.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 w-full rounded-full bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition-all"
          >
            <FaArrowLeft className="text-base" />
            <span>Go Back</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }
  return element;
};
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  userRole: PropTypes.string,
};
export default ProtectedRoute;
