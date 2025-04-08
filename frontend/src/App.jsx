import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Login";
import MasterPage from "./MasterPage";
import Dashboard from "./Pages/Dashboard";
import Student_Manage from "./Pages/Student_Manage";
import Add_Student from "./Pages/Add_Student";
import Add_Faculty from "./Pages/Add_Faculty";
import FacultyManage from "./Pages/Faculty_Manage";
import Holiday from "./Pages/Holiday";
import Add_Holiday from "./Pages/Add_Holiday";
import Change_Password from "./Pages/Change_Password";
import Profile from "./Pages/Profile";
import Class_Manage from "./Pages/Class_Manage";
import Subject_Manage from "./Pages/Subject_Manage";
import Note_Manage from "./Pages/Note_Manage";
import Material from "./Pages/Material";
import Add_Material from "./Pages/Add_Material";
import Leave_Manage from "./Pages/Leave_Manage";
import Add_Leave from "./Pages/Add_Leave";
import Logout from "./Pages/Logout";
import NotFoundPage from "./Components/PageNotFound";
import Forgot_Password from './Forgot_Password.jsx'; 
import OTP_Verify from "./OTP_Verify";
import Reset_Password from "./Reset_Password";
import ProtectedRoute from "./Components/ProtectedRoute";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8081";
axios.defaults.withCredentials = true;

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get("/session");
        console.log("Session Response:", response.data);
        if (response.data && response.data.user) {
          console.log("Setting role:", response.data.user.role);
          setUserRole(response.data.user.role);
        } else {
          setUserRole(null);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSession();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        {/* Wrap routes with MasterPage */}
        <Route path="/" element={<Login setUserRole={setUserRole} />} />
        <Route path="/logout" element={ <Logout /> } />

        <Route path="/dashboard" element={ <ProtectedRoute element={<MasterPage><Dashboard /></MasterPage>} allowedRoles={[1, 2, 3, 4, 5]} userRole={userRole} /> }/>
        <Route path="/student_manage" element={ <ProtectedRoute element={<MasterPage><Student_Manage /></MasterPage>} allowedRoles={[3]} userRole={userRole} /> }/>
        <Route path="/add_student" element={ <ProtectedRoute element={<MasterPage><Add_Student /></MasterPage>} allowedRoles={[3]} userRole={userRole} /> }/>
        <Route path="/add_faculty" element={ <ProtectedRoute element={<MasterPage><Add_Faculty /></MasterPage>} allowedRoles={[3]} userRole={userRole} /> }/>
        <Route path="/faculty_manage" element={ <ProtectedRoute element={<MasterPage><FacultyManage /></MasterPage>} allowedRoles={[4]} userRole={userRole} /> }/>
        <Route path="/holiday" element={ <ProtectedRoute element={<MasterPage><Holiday /></MasterPage>} allowedRoles={[4]} userRole={userRole} /> }/>
        <Route path="/add_holiday" element={ <ProtectedRoute element={<MasterPage><Add_Holiday /></MasterPage>} allowedRoles={[4]} userRole={userRole} /> }/>
        <Route path="/profile" element={ <ProtectedRoute element={<MasterPage><Profile /></MasterPage>} allowedRoles={[3,4]} userRole={userRole} /> }/>
        <Route path="/change_password" element={ <ProtectedRoute element={<MasterPage><Change_Password /></MasterPage>} allowedRoles={[3,4]} userRole={userRole} /> }/>
        <Route path="/class_manage" element={ <ProtectedRoute element={<MasterPage><Class_Manage /></MasterPage>} allowedRoles={[3]} userRole={userRole} /> }/>
        <Route path="/subject_manage" element={ <ProtectedRoute element={<MasterPage><Subject_Manage /></MasterPage>} allowedRoles={[4]} userRole={userRole} /> }/>
        <Route path="/note_manage" element={ <ProtectedRoute element={<MasterPage><Note_Manage /></MasterPage>} allowedRoles={[4]} userRole={userRole} /> }/>
        <Route path="/materials" element={ <ProtectedRoute element={<MasterPage><Material /></MasterPage>} allowedRoles={[4]} userRole={userRole} /> }/>
        <Route path="/add_material" element={ <ProtectedRoute element={<MasterPage><Add_Material /></MasterPage>} allowedRoles={[4]} userRole={userRole} /> }/>
        <Route path="/add_leave" element={ <ProtectedRoute element={<MasterPage><Add_Leave /></MasterPage>} allowedRoles={[4]} userRole={userRole} /> }/>
        <Route path="/leave_manage" element={ <ProtectedRoute element={<MasterPage><Leave_Manage /></MasterPage>} allowedRoles={[4]} userRole={userRole} /> }/>

        <Route path="/forgot_password" element={ <Forgot_Password /> } />
        <Route path="/verify_otp" element={ <OTP_Verify /> } />
        <Route path="/reset_password" element={ <Reset_Password /> } />
        <Route path="/page" element={ <NotFoundPage /> } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};
export default App;