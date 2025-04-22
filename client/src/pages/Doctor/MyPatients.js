import { useEffect, useState } from "react";
import axios from "axios";

const MyPatients = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [triageData, setTriageData] = useState([]);
  const [roomAssignments, setRoomAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [patientsRes, triageRes, roomsRes] = await Promise.all([
        axios.get("http://localhost:6969/api/patients"),
        axios.get("http://localhost:6969/api/triage"),
        axios.get("http://localhost:6969/api/roomassignments"), // see note below
      ]);

      const doctorPatients = patientsRes.data.filter(
        (p) => p.doctor_id === user.userId
      );

      setPatients(doctorPatients);
      setTriageData(triageRes.data);
      setRoomAssignments(roomsRes.data); // e.g. [{ room_no: 101, patient_id: 2 }]
    };

    if (user?.userId) fetchData();
  }, [user?.userId]);

  const getTriageForPatient = (patient_id) => {
    const entries = triageData.filter((t) => t.patient_id === patient_id);
    return entries.length > 0 ? entries[entries.length - 1] : null;
  };

  const getRoomForPatient = (patient_id) => {
    const match = roomAssignments.find((r) => r.patient_id === patient_id);
    return match?.room_no || null;
  };

  return (
    <div>
      <h2>My Patients</h2>
      {patients.length === 0 ? (
        <p>You have no assigned patients.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {patients.map((p) => {
            const triage = getTriageForPatient(p.patient_id);
            const room = getRoomForPatient(p.patient_id);

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
                <p>Room: {room ? `Room ${room}` : "Not assigned"}</p>

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
                    <em>No triage info available.</em>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyPatients;
