import { useEffect, useState } from "react";
import API from "../../api";

const MyAppointments = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [patientsRes, apptsRes] = await Promise.all([
        API.get("/patients"),
        API.get("/appointments"),
      ]);

      const match = patientsRes.data.find((p) => p.username === user.username);
      if (!match) return;

      setPatient(match);
      setPatients(patientsRes.data);

      const myAppointments = apptsRes.data.filter(
        (a) => a.patientId === match.patient_id && a.status !== "Cancelled"
      );

      setAppointments(myAppointments);
    };

    if (user?.username) fetchData();
  }, [user?.username]);

  if (!user || !patient) return null;

  return (
    <div>
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>You have no upcoming appointments.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {appointments.map((a) => (
            <li
              key={a.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
            >
              <p>
                <strong>Date & Time:</strong>{" "}
                {new Date(a.dateTime).toLocaleString()}
              </p>
              <p>
                <strong>Length:</strong> {a.length} minutes
              </p>
              <p>
                <strong>Status:</strong> {a.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAppointments;
