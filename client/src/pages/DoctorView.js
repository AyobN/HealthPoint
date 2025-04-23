import { Link, Routes, Route, useNavigate } from "react-router-dom";
import MyPatients from "./Doctor/MyPatients";
import MyAppointments from "./Doctor/MyAppointments";
import PatientRecords from "./Doctor/PatientRecords";
import PatientTests from "./Doctor/PatientTests";

const DoctorView = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setTimeout(() => navigate("/"), 0);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header
        style={{
          background: "#004080",
          color: "white",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2>Doctor Portal</h2>
          <p>Welcome, {user?.username}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
          Logout
        </button>
      </header>

      <nav className="receptionist-nav">
        <Link to="/doctor/patients">Patients</Link>
        <Link to="/doctor/appointments">Appointments</Link>
        <Link to="/doctor/records">Patient Records</Link>
        <Link to="/doctor/tests">Patient Tests</Link>
      </nav>

      <main style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route
            path=""
            element={<p>Select a section from the navigation above.</p>}
          />
          <Route path="patients" element={<MyPatients user={user} />} />
          <Route path="appointments" element={<MyAppointments user={user} />} />
          <Route path="records" element={<PatientRecords user={user} />} />
          <Route path="tests" element={<PatientTests user={user} />} />
        </Routes>
      </main>
    </div>
  );
};

export default DoctorView;
