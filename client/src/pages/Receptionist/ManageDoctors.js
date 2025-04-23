import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/doctors").then((res) => setDoctors(res.data));
  }, []);

  const filtered = doctors.filter(
    (d) =>
      `${d.first_name} ${d.last_name} ${d.email}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      d.staff_id.toString().includes(search)
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Doctors</h2>
      <Link to="/receptionist/doctors/new">
        <button>Add Doctor</button>
      </Link>

      <input
        type="text"
        placeholder="Search by name, email, or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginTop: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((d) => (
          <li
            key={d.staff_id}
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
                {d.first_name} {d.last_name}
              </strong>
              <br />
              <small>{d.email}</small>
            </div>
            <Link to={`/receptionist/doctors/${d.staff_id}/edit`}>
              <button>Manage</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageDoctors;
