import { Link, Routes, Route } from "react-router-dom";
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

const ReceptionistView = ({ user }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header
        style={{ background: "#004080", color: "white", padding: "1rem" }}
      >
        <h2>Receptionist Portal</h2>
        <p>Welcome, user #{user.userId}</p>
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
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="patients" element={<ManagePatients />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="appointments" element={<ManageAppointments />} />
          <Route path="billing" element={<ManageBilling />} />
          <Route path="" element={<p>Please select a section.</p>} />
          <Route path="doctors/new" element={<DoctorForm />} />
          <Route path="doctors/:id/edit" element={<DoctorForm />} />
          <Route path="patients" element={<ManagePatients />} />
          <Route path="patients/new" element={<PatientForm />} />
          <Route path="patients/:id/edit" element={<PatientForm />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="rooms/new" element={<RoomForm />} />
          <Route path="rooms/:room_no/edit" element={<RoomForm />} />
          <Route path="appointments" element={<ManageAppointments />} />
          <Route
            path="appointments/view/patient"
            element={<AppointmentListByPatient />}
          />
          <Route
            path="appointments/view/doctor"
            element={<AppointmentListByDoctor />}
          />
          <Route path="appointments" element={<ManageAppointments />} />
          <Route
            path="appointments/schedule"
            element={<ScheduleAppointment />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default ReceptionistView;
