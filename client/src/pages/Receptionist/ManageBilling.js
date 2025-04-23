import { useEffect, useState } from "react";
import API from "../../api";
import { Link } from "react-router-dom";

const ManageBilling = () => {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/bills").then((res) => setBills(res.data));
  }, []);

  const filtered = bills.filter(
    (b) =>
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.patient_id.toString().includes(search) ||
      b.bill_id.toString().includes(search)
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Billing</h2>
      <Link to="/receptionist/billing/new">
        <button>Create Bill</button>
      </Link>

      <input
        type="text"
        placeholder="Search bills by description, patient ID, or bill ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: "1rem 0", padding: "0.5rem", width: "100%" }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((b) => (
          <li
            key={b.bill_id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "0.5rem",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Bill ID:</strong> {b.bill_id}
            </p>
            <p>
              <strong>Patient ID:</strong> {b.patient_id}
            </p>
            <p>
              <strong>Description:</strong> {b.description}
            </p>
            <p>
              <strong>Amount:</strong> ${b.amount.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {b.status}
            </p>
            <p>
              <strong>Issued:</strong>{" "}
              {new Date(b.issued_date).toLocaleString()}
            </p>
            <Link to={`/receptionist/billing/edit/${b.bill_id}`}>
              <button>Manage</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageBilling;
