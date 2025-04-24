import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageBilling = () => {
  const [patients, setPatients] = useState([]);
  const [allBills, setAllBills] = useState([]);
  const [billsByPatient, setBillsByPatient] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patientSearch, setPatientSearch] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [billSearch, setBillSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:6969/api/patients")
      .then((res) => setPatients(res.data));

    axios.get("http://localhost:6969/api/bills").then((res) => {
      const numericBills = res.data.map((b) => ({
        ...b,
        amount: Number(b.amount),
      }));
      setAllBills(numericBills);
      setFilteredBills(numericBills); // show all bills by default
    });
  }, []);

  const handlePatientSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setPatientSearch(query);
    const matches = patients.filter(
      (p) =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(query) ||
        p.patient_id.toString().includes(query)
    );
    setFilteredPatients(matches);
  };

  const handlePatientSelect = async (p) => {
    setSelectedPatient(p);
    setPatientSearch(`${p.first_name} ${p.last_name}`);
    setFilteredPatients([]);
    const res = await axios.get(
      `http://localhost:6969/api/bills/patient/${p.patient_id}`
    );
    setBillsByPatient(
      res.data.map((b) => ({ ...b, amount: Number(b.amount) }))
    );
  };

  const handleBillSearch = (e) => {
    const query = e.target.value;
    setBillSearch(query);
    if (!query) {
      setFilteredBills(allBills);
    } else {
      const filtered = allBills.filter((b) =>
        b.bill_id.toString().includes(query)
      );
      setFilteredBills(filtered);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Billing</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/receptionist/billing/new">
          <button>Create Bill</button>
        </Link>
      </div>

      {/* Patient Search Section */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Search by Patient</h3>
        <input
          type="text"
          placeholder="patient name or ID..."
          value={patientSearch}
          onChange={handlePatientSearch}
        />
        <ul
          style={{
            border: "1px solid #ccc",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {filteredPatients.map((p) => (
            <li key={p.patient_id}>
              <button type="button" onClick={() => handlePatientSelect(p)}>
                {p.first_name} {p.last_name} (ID: {p.patient_id})
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bills for Selected Patient */}
      {selectedPatient && (
        <div style={{ marginTop: "2rem" }}>
          <h3>
            Bills for {selectedPatient.first_name} {selectedPatient.last_name}
          </h3>
          {billsByPatient.length === 0 ? (
            <p>No bills found.</p>
          ) : (
            <ul>
              {billsByPatient.map((b) => (
                <li key={b.bill_id} style={{ marginBottom: "1rem" }}>
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
          )}
        </div>
      )}

      {/* Bill ID Search Section */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Search by Bill ID</h3>
        <input
          type="text"
          placeholder="Enter bill ID"
          value={billSearch}
          onChange={handleBillSearch}
        />
        <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
          {filteredBills.map((b) => (
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
              Patient ID: {b.patient_id}
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
    </div>
  );
};

export default ManageBilling;
