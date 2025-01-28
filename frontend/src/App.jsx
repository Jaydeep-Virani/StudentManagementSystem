import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MasterPage from "./MasterPage";
import Dashboard from "./components/Dashboard";
import Student_Manage from "./components/Student_Manage";

const App = () => {
  
  return (
    <Router>
      <Routes>
        {/* Wrap routes with MasterPage */}
        <Route path="/" element={ <MasterPage><Dashboard /></MasterPage> } />
        <Route path="/dashboard" element={ <MasterPage><Dashboard /></MasterPage> }/>
        <Route path="/student_manage" element={ <MasterPage><Student_Manage /></MasterPage> }/>
      </Routes>
    </Router>
  );
};

export default App;