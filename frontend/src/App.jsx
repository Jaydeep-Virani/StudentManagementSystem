import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MasterPage from "./MasterPage";
import Dashboard from "./components/Dashboard";
import Student_Manage from "./components/Student_Manage";
import Add_Student from "./components/Add_Student";

const App = () => {
  
  return (
    <Router>
      <Routes>
        {/* Wrap routes with MasterPage */}
        <Route path="/" element={ <MasterPage><Dashboard /></MasterPage> } />
        <Route path="/dashboard" element={ <MasterPage><Dashboard /></MasterPage> }/>
        <Route path="/student_manage" element={ <MasterPage><Student_Manage /></MasterPage> }/>
        <Route path="/add_student" element={ <MasterPage><Add_Student /></MasterPage> }/>
      </Routes>
    </Router>
  );
};

export default App;