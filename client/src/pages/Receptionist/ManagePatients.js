import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:6969/api/patients")
      .then((res) => setPatients(res.data));
  }, []);

  const filtered = patients.filter((p) =>
    `${p.first_name} ${p.last_name} ${p.email} ${p.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
        placeholder="Search patients by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((p) => (
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagePatients;
