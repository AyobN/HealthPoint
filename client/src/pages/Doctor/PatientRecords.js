import { useEffect, useState } from "react";
import API from "../../api";
import RecordForm from "./RecordForm";

const PatientRecords = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    API.get("/patients").then((res) => setPatients(res.data));
  }, []);

  const handleSelect = async (p) => {
    setSelectedPatient(p);
    setSearch(`${p.first_name} ${p.last_name}`);
    const res = await API.get(`/records/patient/${p.patient_id}`);
    setRecords(res.data);
    setShowForm(false);
  };

  const handleRecordAdded = async () => {
    const res = await API.get(`/records/patient/${selectedPatient.patient_id}`);
    setRecords(res.data);
    setShowForm(false);
  };

  const filtered = patients.filter((p) =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Patient Records</h2>

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
            Records for {selectedPatient.first_name} {selectedPatient.last_name}
          </h3>
          {records.length === 0 ? (
            <p>No records found.</p>
          ) : (
            <ul>
              {records.map((r) => (
                <li
                  key={r.record_id}
                  style={{
                    marginBottom: "1rem",
                    border: "1px solid #ccc",
                    padding: "1rem",
                  }}
                >
                  <p>
                    <strong>Date:</strong> {r.date}
                  </p>
                  <p>
                    <strong>Symptoms:</strong> {r.symptoms}
                  </p>
                  <p>
                    <strong>Diagnosis:</strong> {r.diagnosis}
                  </p>
                  <p>
                    <strong>Notes:</strong> {r.notes || "None"}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setShowForm(true)}>Add Record</button>

          {showForm && (
            <RecordForm
              patient_id={selectedPatient.patient_id}
              doctor_id={user.userId}
              onSuccess={handleRecordAdded}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PatientRecords;
