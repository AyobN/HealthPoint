import { useEffect, useState } from "react";
import axios from "axios";
import TestResultForm from "./TestResultForm";

const TestsToRun = ({ user }) => {
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeTestId, setActiveTestId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [testsRes, patientsRes, doctorsRes] = await Promise.all([
        axios.get("http://localhost:6969/api/tests/pending"),
        axios.get("http://localhost:6969/api/patients"),
        axios.get("http://localhost:6969/api/doctors"),
      ]);

      setTests(testsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
    };

    fetchData();
  }, []);

  const getName = (arr, id, first = "first_name", last = "last_name") => {
    const match = arr.find((x) => x.patient_id === id || x.staff_id === id);
    return match ? `${match[first]} ${match[last]}` : "Unknown";
  };

  const handleSubmit = async () => {
    setActiveTestId(null);
    const res = await axios.get("http://localhost:6969/api/tests/pending");
    setTests(res.data);
  };

  return (
    <div>
      <h2>Tests to Run</h2>
      {tests.length === 0 ? (
        <p>No pending tests.</p>
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
                <strong>Patient:</strong> {getName(patients, t.patient_id)}
              </p>
              <p>
                <strong>Ordered by:</strong> {getName(doctors, t.doctor_id)}
              </p>
              <p>
                <strong>Date:</strong> {t.date}
              </p>

              {activeTestId === t.test_id ? (
                <TestResultForm
                  test_id={t.test_id}
                  labtech_id={user.userId}
                  onSuccess={handleSubmit}
                />
              ) : (
                <button onClick={() => setActiveTestId(t.test_id)}>
                  Record Result
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestsToRun;
