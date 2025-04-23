import { useEffect, useState } from "react";
import API from "../../api";

const CompletedTests = () => {
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [labtechs, setLabtechs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [testsRes, patientsRes, doctorsRes, labtechsRes] =
        await Promise.all([
          API.get("/tests/completed"),
          API.get("/patients"),
          API.get("/doctors"),
          API.get("/labtechs"),
        ]);

      setTests(testsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setLabtechs(labtechsRes.data);
    };

    fetchData();
  }, []);

  const getName = (arr, id) => {
    const match = arr.find((x) => x.patient_id === id || x.staff_id === id);
    return match ? `${match.first_name} ${match.last_name}` : "Unknown";
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
