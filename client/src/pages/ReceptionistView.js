import { Link, Routes, Route, useNavigate } from "react-router-dom";
import ManageDoctors from "./Receptionist/ManageDoctors";
import ManagePatients from "./Receptionist/ManagePatients";
import ManageRooms from "./Receptionist/ManageRooms";
import ManageAppointments from "./Receptionist/ManageAppointments";
import ManageBilling from "./Receptionist/ManageBilling";
import DoctorForm from "./Receptionist/DoctorForm";
import PatientForm from "./Receptionist/PatientForm";
import RoomForm from "./Receptionist/RoomForm";
import AppointmentListByPatient from "./Receptionist/Appointments/AppointmentListByPatient";
import AppointmentListByDoctor from "./Receptionist/Appointments/AppointmentListByDoctor";
import ScheduleAppointment from "./Receptionist/Appointments/ScheduleAppointment";
import BillingListByPatient from "./Receptionist/Billing/BillingListByPatient";
import BillingById from "./Receptionist/Billing/BillingById";
import BillingForm from "./Receptionist/Billing/BillingForm";
import RescheduleAppointment from "./Receptionist/Appointments/RescheduleAppointment";

const ReceptionistView = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setTimeout(() => navigate("/"), 0);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header
        style={{
          background: "#004080",
          color: "white",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2>Receptionist Portal</h2>
          <p>Welcome, {user?.username}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
          Logout
        </button>
      </header>

      {/* Navigation */}
      <nav className="receptionist-nav">
        <Link to="/receptionist/doctors">Doctors</Link>
        <Link to="/receptionist/patients">Patients</Link>
        <Link to="/receptionist/rooms">Rooms</Link>
        <Link to="/receptionist/appointments">Appointments</Link>
        <Link to="/receptionist/billing">Billing</Link>
      </nav>

      {/* Main content area */}
      <main style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route path="" element={<p>Please select a section.</p>} />

          {/* Doctor Management */}
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="doctors/new" element={<DoctorForm />} />
          <Route path="doctors/:id/edit" element={<DoctorForm />} />

          {/* Patient Management */}
          <Route path="patients" element={<ManagePatients />} />
          <Route path="patients/new" element={<PatientForm />} />
          <Route path="patients/:id/edit" element={<PatientForm />} />

          {/* Room Management */}
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="rooms/new" element={<RoomForm />} />
          <Route path="rooms/:room_no/edit" element={<RoomForm />} />

          {/* Appointments */}
          <Route path="appointments" element={<ManageAppointments />} />
          <Route
            path="appointments/schedule"
            element={<ScheduleAppointment />}
          />
          <Route
            path="appointments/view/patient"
            element={<AppointmentListByPatient />}
          />
          <Route
            path="appointments/view/doctor"
            element={<AppointmentListByDoctor />}
          />
          <Route
            path="appointments/reschedule/:id"
            element={<RescheduleAppointment />}
          />

          {/* Billing */}
          <Route path="billing" element={<ManageBilling />} />
          <Route
            path="billing/patient/:id"
            element={<BillingListByPatient />}
          />
          <Route path="billing/bill/:id" element={<BillingById />} />
          <Route path="billing/new" element={<BillingForm />} />
          <Route path="billing/edit/:id" element={<BillingForm />} />
        </Routes>
      </main>
    </div>
  );
};

export default ReceptionistView;
