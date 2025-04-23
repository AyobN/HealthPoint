import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/patients").then((res) => setPatients(res.data));
  }, []);

  const filtered = patients.filter(
    (p) =>
      `${p.first_name} ${p.last_name} ${p.email} ${p.phone}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      p.patient_id.toString().includes(search)
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Patients</h2>
      <Link to="/receptionist/patients/new">
        <button>Add Patient</button>
      </Link>

      <input
        type="text"
        placeholder="Search by name, email, phone, or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginTop: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((p) => (
          <li
            key={p.patient_id}
            style={{
              border: "1px solid #ccc",
              padding: "0.75rem",
              marginBottom: "0.5rem",
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
              <button disabled>Delete</button> {/* optional */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagePatients;
