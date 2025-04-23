import { useEffect, useState } from "react";
import API from "../../api";

const MyBills = ({ user }) => {
  const [patient, setPatient] = useState(null);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      const patientsRes = await API.get("/patients");
      const match = patientsRes.data.find((p) => p.username === user.username);
      if (!match) return;

      setPatient(match);

      const billsRes = await API.get(`/bills/patient/${match.patient_id}`);
      setBills(billsRes.data);
    };

    if (user?.username) fetchBills();
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
