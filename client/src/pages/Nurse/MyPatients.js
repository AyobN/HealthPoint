import { useEffect, useState } from "react";
import axios from "axios";
import TriageForm from "./TriageForm";

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [triageData, setTriageData] = useState([]);
  const [roomAssignments, setRoomAssignments] = useState([]);
  const [activeTriage, setActiveTriage] = useState(null); // patient_id of open form

  useEffect(() => {
    const fetchData = async () => {
      const [patientsRes, triageRes, roomsRes] = await Promise.all([
        axios.get("http://localhost:6969/api/patients"),
        axios.get("http://localhost:6969/api/triage"),
        axios.get("http://localhost:6969/api/roomassignments"),
      ]);
      setPatients(patientsRes.data);
      setTriageData(triageRes.data);
      setRoomAssignments(roomsRes.data);
    };

    fetchData();
  }, []);

  const getTriage = (patient_id) => {
    const entries = triageData.filter((t) => t.patient_id === patient_id);
    return entries.length > 0 ? entries[entries.length - 1] : null;
  };

  const getRoom = (patient_id) => {
    const r = roomAssignments.find((r) => r.patient_id === patient_id);
    return r ? `Room ${r.room_no}` : "Unassigned";
  };

  const handleTriageSubmit = () => {
    setActiveTriage(null);
    // re-fetch to reflect new triage
    axios.get("http://localhost:6969/api/triage").then((res) => {
      setTriageData(res.data);
    });
  };

  return (
    <div>
      <h2>My Patients</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {patients.map((p) => {
          const triage = getTriage(p.patient_id);
          const room = getRoom(p.patient_id);

          return (
            <li
              key={p.patient_id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                maxWidth: "500px",
              }}
            >
              <p>
                <strong>
                  {p.first_name} {p.last_name}
                </strong>{" "}
                (ID: {p.patient_id})
              </p>
              <p>Status: {p.status}</p>
              <p>Room: {room}</p>

              {triage ? (
                <>
                  <p>
                    <strong>Triage:</strong>
                  </p>
                  <ul>
                    <li>BP: {triage.bp}</li>
                    <li>HR: {triage.heart_rate}</li>
                    <li>Rating: {triage.rating}</li>
                  </ul>
                </>
              ) : (
                <p>
                  <em>No triage recorded</em>
                </p>
              )}

              {activeTriage === p.patient_id ? (
                <TriageForm
                  patient_id={p.patient_id}
                  onSuccess={handleTriageSubmit}
                />
              ) : (
                <button onClick={() => setActiveTriage(p.patient_id)}>
                  {triage ? "Update Triage" : "Record Triage"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyPatients;
