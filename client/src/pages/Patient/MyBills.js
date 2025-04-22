import { useEffect, useState } from "react";
import axios from "axios";

const MyBills = ({ user }) => {
  const [patient, setPatient] = useState(null);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    if (!user?.username) return;

    const fetchBills = async () => {
      const patientsRes = await axios.get("http://localhost:6969/api/patients");
      const match = patientsRes.data.find((p) => p.username === user.username);
      if (!match) return;

      setPatient(match);

      const billsRes = await axios.get(
        `http://localhost:6969/api/bills/patient/${match.patient_id}`
      );
      setBills(billsRes.data);
    };

    fetchBills();
  }, [user?.username]);

  if (!user || !patient) return null;

  return (
    <div>
      <h2>My Bills</h2>
      {bills.length === 0 ? (
        <p>You have no bills at this time.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {bills.map((b) => (
            <li
              key={b.bill_id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                maxWidth: "500px",
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBills;
