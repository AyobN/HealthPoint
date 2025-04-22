import { useEffect, useState } from "react";
import axios from "axios";

const ScheduleAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [date, setDate] = useState("");
  const [length, setLength] = useState("30");

  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:6969/api/doctors")
      .then((res) => setDoctors(res.data));
    axios
      .get("http://localhost:6969/api/patients")
      .then((res) => setPatients(res.data));
  }, []);

  useEffect(() => {
    if (selectedDoctor && date && length) {
      axios
        .get(
          `http://localhost:6969/api/doctors/${selectedDoctor.staff_id}/availability`,
          {
            params: { date, length },
          }
        )
        .then((res) => setAvailableSlots(res.data));
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, date, length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedDoctor ||
      !selectedPatient ||
      !date ||
      !selectedTime ||
      !length
    )
      return;

    const fullDateTime = `${date}T${selectedTime}`;
    try {
      await axios.post("http://localhost:6969/api/appointments", {
        doctorId: selectedDoctor.staff_id,
        patientId: selectedPatient.patient_id,
        dateTime: fullDateTime,
        length: parseInt(length),
        status: "Scheduled",
      });

      setMessage("Appointment successfully scheduled.");
      setSelectedDoctor(null);
      setSelectedPatient(null);
      setDate("");
      setLength("30");
      setSelectedTime("");
      setDoctorSearch("");
      setPatientSearch("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to schedule appointment."
      );
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
      <h2>Schedule Appointment</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {/* Doctor Search */}
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

        {/* Patient Search */}
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

        {/* Date and Length */}
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Length (minutes):</label>
        <select
          value={length}
          onChange={(e) => setLength(e.target.value)}
          required
        >
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="60">60</option>
        </select>

        {/* Time Slot Selection */}
        {availableSlots.length > 0 && (
          <>
            <label>Select Time Slot:</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            >
              <option value="">-- Choose a time --</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </>
        )}

        <button
          type="submit"
          disabled={
            !selectedDoctor || !selectedPatient || !date || !selectedTime
          }
        >
          Schedule Appointment
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ScheduleAppointment;
