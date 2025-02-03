import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user session (Token or Auth Data)
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userSession");

    // Show success toast message
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-500 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Logging out...</h2>
        <p className="text-gray-500">You will be redirected shortly.</p>
      </div>
    </div>
  );
};

export default Logout;
