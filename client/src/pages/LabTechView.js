import { Link, Routes, Route, useNavigate } from "react-router-dom";
import TestsToRun from "./LabTech/TestsToRun";
import CompletedTests from "./LabTech/CompletedTests";

const LabTechView = ({ user, setUser }) => {
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
          <h2>Lab Technician Portal</h2>
          <p>Welcome, {user?.username}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
          Logout
        </button>
      </header>

      <nav className="receptionist-nav">
        <Link to="/labtechnician/tests">Tests to Run</Link>
        <Link to="/labtechnician/completed">Completed Tests</Link>
      </nav>

      <main style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route path="tests" element={<TestsToRun user={user} />} />
          <Route path="completed" element={<CompletedTests />} />
          <Route path="" element={<p>Select a tab above to get started.</p>} />
        </Routes>
      </main>
    </div>
  );
};

export default LabTechView;
