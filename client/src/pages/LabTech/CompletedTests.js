import { useEffect, useState } from "react";
import axios from "axios";

const CompletedTests = () => {
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [labtechs, setLabtechs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [testsRes, patientsRes, doctorsRes, labtechsRes] =
        await Promise.all([
          axios.get("http://localhost:6969/api/tests/completed"),
          axios.get("http://localhost:6969/api/patients"),
          axios.get("http://localhost:6969/api/doctors"),
          axios.get("http://localhost:6969/api/labtechs"), // optional, or load from backend
        ]);

      setTests(testsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setLabtechs(labtechsRes.data || []); // fallback
    };

    fetchData();
  }, []);

  const getName = (arr, id, first = "first_name", last = "last_name") => {
    const match = arr.find((x) => x.patient_id === id || x.staff_id === id);
    return match ? `${match[first]} ${match[last]}` : "Unknown";
  };

  return (
    <div>
      <h2>Completed Tests</h2>
      {tests.length === 0 ? (
        <p>No completed tests.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tests.map((t) => (
            <li
              key={t.test_id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <p>
                <strong>Test:</strong> {t.test_name}
              </p>
              <p>
                <strong>Result:</strong> {t.result}
              </p>
              <p>
                <strong>Patient:</strong> {getName(patients, t.patient_id)}
              </p>
              <p>
                <strong>Ordered by:</strong> {getName(doctors, t.doctor_id)}
              </p>
              <p>
                <strong>Completed by:</strong> {getName(labtechs, t.labtech_id)}
              </p>
              <p>
                <strong>Date:</strong> {t.date}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedTests;
