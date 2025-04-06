import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import MasterPage from "./MasterPage";
import Dashboard from "./Pages/Dashboard";
import Student_Manage from "./Pages/Student_Manage";
import Add_Student from "./Pages/Add_Student";
import Add_Faculty from "./Pages/Add_Faculty ";
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

import axios from "axios";

axios.defaults.baseURL = "http://localhost:8081";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Wrap routes with MasterPage */}
        <Route path="/" element={ <Login /> } />
        <Route path="/logout" element={ <Logout /> } />
        <Route path="/dashboard" element={ <MasterPage><Dashboard /></MasterPage> }/>
        <Route path="/student_manage" element={ <MasterPage><Student_Manage /></MasterPage> }/>
        <Route path="/add_student" element={ <MasterPage><Add_Student /></MasterPage> }/>
        <Route path="/add_faculty" element={ <MasterPage><Add_Faculty /></MasterPage> }/>
        <Route path="/faculty_manage" element={ <MasterPage><FacultyManage /></MasterPage> }/>
        <Route path="/holiday" element={ <MasterPage><Holiday /></MasterPage> }/>
        <Route path="/add_holiday" element={ <MasterPage><Add_Holiday /></MasterPage> }/>
        <Route path="/profile" element={ <MasterPage><Profile/></MasterPage> }/>
        <Route path="/change_password" element={ <MasterPage><Change_Password /></MasterPage> }/>
        <Route path="/class_manage" element={ <MasterPage><Class_Manage /></MasterPage> }/>
        <Route path="/subject_manage" element={ <MasterPage><Subject_Manage /></MasterPage> }/>
        <Route path="/note_manage" element={ <MasterPage><Note_Manage /></MasterPage> }/>
        <Route path="/materials" element={ <MasterPage><Material /></MasterPage> }/>
        <Route path="/add_material" element={ <MasterPage><Add_Material /></MasterPage> }/>
        <Route path="/add_leave" element={ <MasterPage><Add_Leave /></MasterPage> }/>
        <Route path="/leave_manage" element={ <MasterPage><Leave_Manage /></MasterPage> }/>
        <Route path="/forgot_password" element={ <Forgot_Password /> } />
        <Route path="/verify_otp" element={ <OTP_Verify /> } />
        <Route path="/reset_password" element={ <Reset_Password /> } />
        <Route path="/page" element={ <NotFoundPage /> } />
      </Routes>
    </Router>
  );
};

export default App;