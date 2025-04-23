import { Link, Routes, Route, useNavigate } from "react-router-dom";
import MyDoctor from "./Patient/MyDoctor";
import MyAppointments from "./Patient/MyAppointments";
import MyBills from "./Patient/MyBills";

const PatientView = ({ user, setUser }) => {
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
          <h2>Patient Portal</h2>
          <p>Welcome, {user?.username}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
          Logout
        </button>
      </header>

      <nav className="receptionist-nav">
        <Link to="/patient/doctor">My Doctor</Link>
        <Link to="/patient/appointments">My Appointments</Link>
        <Link to="/patient/bills">My Bills</Link>
      </nav>

      <main style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route
            path=""
            element={<p>Select a section from the navigation above.</p>}
          />
          <Route path="doctor" element={<MyDoctor user={user} />} />
          <Route path="appointments" element={<MyAppointments user={user} />} />
          <Route path="bills" element={<MyBills user={user} />} />
        </Routes>
      </main>
    </div>
  );
};

export default PatientView;
