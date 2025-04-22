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
        {/* Login */}
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

        {/* Patient Portal */}
        <Route
          path="/patient/*"
          element={<PatientView user={user} setUser={setUser} />}
        />

        {/* Doctor Portal */}
        <Route
          path="/doctor/*"
          element={<DoctorView user={user} setUser={setUser} />}
        />

        {/* Nurse Portal */}
        <Route
          path="/nurse/*"
          element={<NurseView user={user} setUser={setUser} />}
        />

        {/* Receptionist Portal */}
        <Route
          path="/receptionist/*"
          element={<ReceptionistView user={user} setUser={setUser} />}
        />

        {/* Lab Technician Portal */}
        <Route
          path="/labtechnician/*"
          element={<LabTechView user={user} setUser={setUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
