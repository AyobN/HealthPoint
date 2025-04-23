import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:6969/api/doctors")
      .then((res) => setDoctors(res.data));
  }, []);

  const filtered = doctors.filter((d) =>
    `${d.first_name} ${d.last_name} ${d.email} ${d.specialty}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Doctors</h2>

      <div style={{ marginBottom: "1rem" }}>
        <Link to="/receptionist/doctors/new">
          <button>Add Doctor</button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search doctors by name, email, or specialty..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((doc) => (
          <li
            key={doc.staff_id}
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
                {doc.first_name} {doc.last_name}
              </strong>
              <br />
              <small>License No: {doc.license_no}</small>
              <br />
              <small>Specialty: {doc.specialty}</small>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link to={`/receptionist/doctors/${doc.staff_id}/edit`}>
                <button>Manage</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageDoctors;
