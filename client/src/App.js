import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import PatientView from "./pages/PatientView";
import DoctorView from "./pages/DoctorView";
import NurseView from "./pages/NurseView";
import ReceptionistView from "./pages/ReceptionistView";
import LabTechView from "./pages/LabTechView";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/${user.role}`} />
            ) : (
              <Login onLogin={setUser} />
            )
          }
        />
        <Route path="/patient" element={<PatientView user={user} />} />
        <Route path="/doctor" element={<DoctorView user={user} />} />
        <Route path="/nurse" element={<NurseView user={user} />} />
        <Route
          path="/receptionist"
          element={<ReceptionistView user={user} />}
        />
        <Route path="/labtechnician" element={<LabTechView user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
