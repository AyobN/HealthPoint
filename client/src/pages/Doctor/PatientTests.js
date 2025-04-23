import { useEffect, useState } from "react";
import axios from "axios";
import TestForm from "./TestForm";

const PatientTests = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:6969/api/patients")
      .then((res) => setPatients(res.data));
  }, []);

  const handleSelect = async (p) => {
    setSelectedPatient(p);
    setSearch(`${p.first_name} ${p.last_name}`);
    const res = await axios.get(
      `http://localhost:6969/api/tests/patient/${p.patient_id}`
    );
    setTests(res.data);
    setShowForm(false);
  };

  const handleTestAdded = async () => {
    const res = await axios.get(
      `http://localhost:6969/api/tests/patient/${selectedPatient.patient_id}`
    );
    setTests(res.data);
    setShowForm(false);
  };

  const filtered = patients.filter((p) =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Patient Tests</h2>

      <label>Search Patient:</label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul
        style={{
          border: "1px solid #ccc",
          maxHeight: "150px",
          overflowY: "auto",
        }}
      >
        {filtered.map((p) => (
          <li key={p.patient_id}>
            <button type="button" onClick={() => handleSelect(p)}>
              {p.first_name} {p.last_name} (ID: {p.patient_id})
            </button>
          </li>
        ))}
      </ul>

      {selectedPatient && (
        <>
          <h3>
            Tests for {selectedPatient.first_name} {selectedPatient.last_name}
          </h3>
          {tests.length === 0 ? (
            <p>No tests found.</p>
          ) : (
            <ul>
              {tests.map((t) => (
                <li
                  key={t.test_id}
                  style={{
                    marginBottom: "1rem",
                    border: "1px solid #ccc",
                    padding: "1rem",
                  }}
                >
                  <p>
                    <strong>Date:</strong> {t.date}
                  </p>
                  <p>
                    <strong>Test Name:</strong> {t.test_name}
                  </p>
                  <p>
                    <strong>Result:</strong> {t.result || "Pending"}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setShowForm(true)}>Add Test</button>

          {showForm && (
            <TestForm
              patient_id={selectedPatient.patient_id}
              doctor_id={user.userId}
              onSuccess={handleTestAdded}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PatientTests;
