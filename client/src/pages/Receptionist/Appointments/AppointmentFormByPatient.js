import { useState, useEffect } from "react";
import axios from "axios";

const AppointmentFormByPatient = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [dateTime, setDateTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:6969/api/doctors")
      .then((res) => setDoctors(res.data));
    axios
      .get("http://localhost:6969/api/patients")
      .then((res) => setPatients(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:6969/api/appointments", {
        doctorId: selectedDoctor.staff_id,
        patientId: selectedPatient.patient_id,
        dateTime,
      });
      setMessage("Appointment successfully booked.");
      setSelectedDoctor(null);
      setSelectedPatient(null);
      setDateTime("");
      setDoctorSearch("");
      setPatientSearch("");
    } catch {
      setMessage("Failed to book appointment.");
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    `${d.first_name} ${d.last_name}`
      .toLowerCase()
      .includes(doctorSearch.toLowerCase())
  );

  const filteredPatients = patients.filter((p) =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(patientSearch.toLowerCase())
  );

  return (
    <div style={{ padding: "1rem", maxWidth: "600px" }}>
      <h2>Book Appointment by Patient</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label>Search Patient:</label>
          <input
            type="text"
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
          />
          <ul
            style={{
              border: "1px solid #ccc",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {filteredPatients.map((p) => (
              <li key={p.patient_id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPatient(p);
                    setPatientSearch(`${p.first_name} ${p.last_name}`);
                  }}
                >
                  {p.first_name} {p.last_name} (ID: {p.patient_id})
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label>Search Doctor:</label>
          <input
            type="text"
            value={doctorSearch}
            onChange={(e) => setDoctorSearch(e.target.value)}
          />
          <ul
            style={{
              border: "1px solid #ccc",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {filteredDoctors.map((d) => (
              <li key={d.staff_id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDoctor(d);
                    setDoctorSearch(`${d.first_name} ${d.last_name}`);
                  }}
                >
                  {d.first_name} {d.last_name} (ID: {d.staff_id})
                </button>
              </li>
            ))}
          </ul>
        </div>

        <label>Date & Time:</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={!selectedDoctor || !selectedPatient || !dateTime}
        >
          Book Appointment
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default AppointmentFormByPatient;
