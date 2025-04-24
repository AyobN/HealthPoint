import { useEffect, useState } from "react";
import axios from "axios";

const MyAppointments = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [appointmentsRes, patientsRes] = await Promise.all([
        axios.get("http://localhost:6969/api/appointments"),
        axios.get("http://localhost:6969/api/patients"),
      ]);

      const upcoming = appointmentsRes.data.filter(
        (a) =>
          a.doctor_id === user.userId &&
          a.status !== "Cancelled" &&
          new Date(a.date_time) >= new Date()
      );

      setAppointments(upcoming);
      setPatients(patientsRes.data);
    };

    if (user?.userId) fetchData();
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
            const patient = getPatient(a.patient_id);
            return (
              <li
                key={a.appointment_id}
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
                  {new Date(a.date_time).toLocaleString()}
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
