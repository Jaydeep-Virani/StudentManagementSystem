import { useState, useEffect } from "react";
import axios from "axios";
import Dashboard_Card from "../Components/Dashboard_Card";

const Dashboard = () => {
  const [userSession, setUserSession] = useState(null);
  const [totals, setTotals] = useState({
    students: 0,
    faculty: 0,
    classes: 0,
    subjects: 0,
    notes:0,
  });

  const checkSession = async () => {
    try {
      const response = await axios.get("http://localhost:8081/session", {
        withCredentials: true,
      });
      setUserSession(response.data.user);
    } catch (error) {
      console.error("No Active Session:", error.response?.data || error);
      setUserSession(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (userSession) {
      axios
        .get("http://localhost:8081/dashboard_totals", {
          withCredentials: true,
        })
        .then((response) => {
          console.log("✅ API Response Data:", response.data);
          setTotals({
            students: response.data.students || 0,
            faculty: response.data.faculty || 0,
            classes: response.data.classes || 0,
            subjects: response.data.subjects || 0,
            notes: response.data.notes || 0,
          });
        })
        .catch((error) => {
          console.error("❌ API Fetch Error:", error);
        });
    }
  }, [userSession]);

  const role = userSession?.role;

  const renderCards = () => {
    if (role === 1) {
      // Admin
      return (
        <>
          <Dashboard_Card name="Students" total={totals.students} link="/student_manage" />
          <Dashboard_Card name="Faculty" total={totals.faculty} link="/faculty_manage" />
          <Dashboard_Card name="Class" total={totals.classes} link="/class_manage" />
          <Dashboard_Card name="Subjects" total={totals.subjects} link="/subject_manage" />
        </>
      );
    }else if (role === 3) {
      return (
        <>
          <Dashboard_Card name="Students" total={totals.students} link="/student_manage" />
          <Dashboard_Card name="Class" total={totals.classes} link="/class_manage" />
          <Dashboard_Card name="Subjects" total={totals.subjects} link="/subject_manage" />
        </>
      );
    } else if (role === 4) {
      // Student
      return (
        <>
          <Dashboard_Card name="Notes" total={totals.notes} link="/note_manage" />
        </>
      );
    } else {
      return <div>❌ Unauthorized access</div>;
    }
  };

  return (
    <div className="flex flex-wrap gap-6 justify-start">
      {renderCards()}
    </div>
  );
};

export default Dashboard;
