import { useEffect, useState } from "react";
import API from "../../api";

const MyAppointments = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [appointmentsRes, patientsRes] = await Promise.all([
        API.get("/appointments"),
        API.get("/patients"),
      ]);

      setPatients(patientsRes.data);

      const filtered = appointmentsRes.data.filter(
        (a) => a.doctorId === user.userId && a.status !== "Cancelled"
      );

      setAppointments(filtered);
    };

    fetchData();
  }, [user?.userId]);

  const getPatient = (id) => patients.find((p) => p.patient_id === id);

  return (
    <div>
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>You have no upcoming appointments.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {appointments.map((a) => {
            const patient = getPatient(a.patientId);
            return (
              <li
                key={a.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  maxWidth: "500px",
                }}
              >
                <p>
                  <strong>Date & Time:</strong>{" "}
                  {new Date(a.dateTime).toLocaleString()}
                </p>
                <p>
                  <strong>Patient:</strong>{" "}
                  {patient
                    ? `${patient.first_name} ${patient.last_name}`
                    : "Unknown"}
                </p>
                <p>
                  <strong>Length:</strong> {a.length} minutes
                </p>
                <p>
                  <strong>Status:</strong> {a.status}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyAppointments;
