import { Link } from "react-router-dom";

const ManageAppointments = () => {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Appointments</h2>

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Link to="/receptionist/appointments/schedule">
          <button>Schedule Appointment</button>
        </Link>

        <div>
          <h3>View Appointments</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/receptionist/appointments/view/doctor">
              <button>By Doctor</button>
            </Link>
            <Link to="/receptionist/appointments/view/patient">
              <button>By Patient</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
