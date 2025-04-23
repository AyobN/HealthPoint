import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const res = await axios.get("http://localhost:6969/api/patients");
    setPatients(res.data);
  };

  const handleAdmit = async (id) => {
    try {
      await axios.post(`http://localhost:6969/api/patients/${id}/admit`);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to admit patient.");
    }
  };

  const handleDischarge = async (id) => {
    try {
      await axios.post(`http://localhost:6969/api/patients/${id}/discharge`);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to discharge patient.");
    }
  };

  const filtered = patients.filter(
    (p) =>
      `${p.first_name} ${p.last_name} ${p.email} ${p.phone}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      p.patient_id.toString().includes(search)
  );

  const inpatients = filtered.filter((p) => p.status === "inpatient");
  const outpatients = filtered.filter((p) => p.status === "outpatient");

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Patients</h2>

      <div style={{ marginBottom: "1rem" }}>
        <Link to="/receptionist/patients/new">
          <button>Add Patient</button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name, email, phone, or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1.5rem", padding: "0.5rem", width: "100%" }}
      />

      {/* Inpatients Section */}
      {inpatients.length > 0 && (
        <>
          <h3>Inpatients</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {inpatients.map((p) => (
              <li
                key={p.patient_id}
                style={{
                  border: "1px solid #ccc",
                  marginBottom: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <strong>
                    {p.first_name} {p.last_name}
                  </strong>
                  <br />
                  <small>{p.email}</small>
                  <br />
                  <small>{p.phone}</small>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link to={`/receptionist/patients/${p.patient_id}/edit`}>
                    <button>Manage</button>
                  </Link>
                  <button onClick={() => handleDischarge(p.patient_id)}>
                    Discharge
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Outpatients Section */}
      <h3>All Patients</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {outpatients.map((p) => (
          <li
            key={p.patient_id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "0.5rem",
              padding: "0.75rem",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div>
              <strong>
                {p.first_name} {p.last_name}
              </strong>
              <br />
              <small>{p.email}</small>
              <br />
              <small>{p.phone}</small>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link to={`/receptionist/patients/${p.patient_id}/edit`}>
                <button>Manage</button>
              </Link>
              <button onClick={() => handleAdmit(p.patient_id)}>Admit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagePatients;
