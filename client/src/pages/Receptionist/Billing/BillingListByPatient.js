import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BillingListByPatient = () => {
  const { id } = useParams();
  const [bills, setBills] = useState([]);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:6969/api/patients`).then((res) => {
      const match = res.data.find((p) => p.patient_id === parseInt(id));
      setPatient(match);
    });

    axios.get(`http://localhost:6969/api/bills/patient/${id}`).then((res) => {
      setBills(res.data);
    });
  }, [id]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>
        Bills for Patient{" "}
        {patient ? `${patient.first_name} ${patient.last_name}` : id}
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {bills.map((b) => (
          <li
            key={b.bill_id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <strong>{b.description}</strong>
            <br />
            Amount: ${b.amount.toFixed(2)}
            <br />
            Status: {b.status}
            <br />
            Issued: {new Date(b.issued_date).toLocaleString()}
            <br />
            <Link to={`/receptionist/billing/edit/${b.bill_id}`}>
              <button>Manage</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillingListByPatient;
