import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    API.get("/appointments").then((res) => setAppointments(res.data));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Appointments</h2>
      <Link to="/receptionist/appointments/schedule">
        <button>Schedule Appointment</button>
      </Link>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
        {appointments.map((a) => (
          <li
            key={a.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "0.5rem",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Date & Time:</strong>{" "}
              {new Date(a.dateTime).toLocaleString()}
            </p>
            <p>
              <strong>Patient ID:</strong> {a.patientId}
            </p>
            <p>
              <strong>Doctor ID:</strong> {a.doctorId}
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
    </div>
  );
};

export default ManageAppointments;
