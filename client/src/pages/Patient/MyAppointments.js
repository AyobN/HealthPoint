import { useEffect, useState } from "react";
import axios from "axios";

const MyAppointments = ({ user }) => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (!user?.username) return;

    const fetchEverything = async () => {
      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        axios.get("http://localhost:6969/api/patients"),
        axios.get("http://localhost:6969/api/doctors"),
        axios.get("http://localhost:6969/api/appointments"),
      ]);

      const patientMatch = patientsRes.data.find(
        (p) => p.username === user.username
      );
      if (!patientMatch) return;

      setPatient(patientMatch);
      setDoctors(doctorsRes.data);

      const futureAppointments = appointmentsRes.data.filter(
        (a) =>
          a.patientId === patientMatch.patient_id &&
          a.status !== "Cancelled" &&
          new Date(a.dateTime) >= new Date()
      );

      setAppointments(futureAppointments);
    };

    fetchEverything();
  }, [user?.username]);

  const getDoctor = (id) => doctors.find((d) => d.staff_id === id);

  if (!user) return null; // logout safety
  if (!patient) return <p>Loading patient info...</p>;

  return (
    <div>
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>You have no upcoming appointments.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {appointments.map((a) => {
            const doctor = getDoctor(a.doctorId);
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
                  <strong>Doctor:</strong>{" "}
                  {doctor
                    ? `${doctor.first_name} ${doctor.last_name}`
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
