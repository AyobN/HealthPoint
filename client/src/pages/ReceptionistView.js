import React, { useEffect, useState } from "react";
import axios from "axios";

const ReceptionistView = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [confirmation, setConfirmation] = useState("");

  // Fetch all data when page loads
  useEffect(() => {
    axios
      .get("http://localhost:6969/api/patients")
      .then((res) => setPatients(res.data));
    axios
      .get("http://localhost:6969/api/doctors")
      .then((res) => setDoctors(res.data));
    axios
      .get("http://localhost:6969/api/appointments")
      .then((res) => setAppointments(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:6969/api/appointments", {
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        dateTime,
      });
      setConfirmation("Appointment booked successfully.");
      setAppointments((prev) => [...prev, res.data.appointment]);

      // Reset form
      setPatientId("");
      setDoctorId("");
      setDateTime("");
    } catch (err) {
      setConfirmation("Failed to book appointment.");
    }
  };

  return (
    <div>
      <h2>Welcome, Receptionist #{user.userId}</h2>

      <h3>Book an Appointment</h3>
      <form onSubmit={handleSubmit}>
        <label>Patient:</label>
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        >
          <option value="">Select a patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <label>Doctor:</label>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        >
          <option value="">Select a doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <label>Date & Time:</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />

        <button type="submit">Book Appointment</button>
      </form>

      {confirmation && <p>{confirmation}</p>}

      <h3>All Appointments</h3>
      <ul>
        {appointments.map((appt) => {
          const patient = patients.find((p) => p.id === appt.patientId);
          const doctor = doctors.find((d) => d.id === appt.doctorId);
          return (
            <li key={appt.id}>
              {new Date(appt.dateTime).toLocaleString()} –{" "}
              {patient?.name || "Unknown Patient"} with{" "}
              {doctor?.name || "Unknown Doctor"}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ReceptionistView;
