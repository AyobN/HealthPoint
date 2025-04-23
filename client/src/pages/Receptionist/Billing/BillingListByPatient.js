import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../../api";

const BillingListByPatient = () => {
  const { id } = useParams();
  const [bills, setBills] = useState([]);

  useEffect(() => {
    API.get(`/bills/patient/${id}`).then((res) => setBills(res.data));
  }, [id]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Bills for Patient #{id}</h2>
      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {bills.map((b) => (
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
      )}
    </div>
  );
};

export default BillingListByPatient;
