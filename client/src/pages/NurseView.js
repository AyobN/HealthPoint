import { Link, Routes, Route, useNavigate } from "react-router-dom";
import MyPatients from "./Nurse/MyPatients";

const NurseView = ({ user, setUser }) => {
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
          <h2>Nurse Portal</h2>
          <p>Welcome, {user?.username}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
          Logout
        </button>
      </header>

      <nav className="receptionist-nav">
        <Link to="/nurse/patients">My Patients</Link>
      </nav>

      <main style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route path="patients" element={<MyPatients user={user} />} />
          <Route
            path=""
            element={<p>Select a section from the navigation above.</p>}
          />
        </Routes>
      </main>
    </div>
  );
};

export default NurseView;
