import { useEffect, useState } from "react";
import API from "../../api";

const MyPatients = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [triageData, setTriageData] = useState([]);
  const [roomAssignments, setRoomAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [patientsRes, triageRes, roomRes] = await Promise.all([
        API.get("/patients"),
        API.get("/triage"),
        API.get("/roomassignments"),
      ]);

      const assigned = patientsRes.data.filter(
        (p) => p.doctor_id === user.userId
      );

      setPatients(assigned);
      setTriageData(triageRes.data);
      setRoomAssignments(roomRes.data);
    };

    fetchData();
  }, [user?.userId]);

  const getTriage = (patient_id) => {
    const entries = triageData.filter((t) => t.patient_id === patient_id);
    return entries.length > 0 ? entries[entries.length - 1] : null;
  };

  const getRoom = (patient_id) => {
    const r = roomAssignments.find((r) => r.patient_id === patient_id);
    return r ? `Room ${r.room_no}` : "Unassigned";
  };

  return (
    <div>
      <h2>My Patients</h2>
      {patients.length === 0 ? (
        <p>You have no assigned patients.</p>
      ) : (
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
