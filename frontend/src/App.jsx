import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import MasterPage from "./MasterPage";
import Dashboard from "./components/Dashboard";
import Student_Manage from "./components/Student_Manage";
import Add_Student from "./components/Add_Student";
import Add_Faculty from "./components/Add_Faculty ";
import FacultyManage from "./components/Faculty_Manage";
import Holiday from "./components/Holiday";
import Add_Holiday from "./components/Add_Holiday";
import Change_Password from "./components/Change_Password";
import Profile from "./components/Profile";
import Class_Manage from "./components/Class_Manage";
import Subject_Manage from "./components/Subject_Manage";
import Note_Manage from "./components/Note_Manage";

const App = () => {
  
  return (
    <Router>
      <Routes>
        {/* Wrap routes with MasterPage */}
        <Route path="/" element={ <Login /> } />
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
      </Routes>
    </Router>
  );
};

export default App;