import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const RescheduleAppointment = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const oldAppointment = state?.appointment;
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [date, setDate] = useState("");
  const [length, setLength] = useState(30);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [dRes, pRes] = await Promise.all([
        axios.get("http://localhost:6969/api/doctors"),
        axios.get("http://localhost:6969/api/patients"),
      ]);
      setDoctors(dRes.data);
      setPatients(pRes.data);

      if (oldAppointment) {
        const doctorMatch = dRes.data.find(
          (d) => d.staff_id === oldAppointment.doctor_id
        );
        const patientMatch = pRes.data.find(
          (p) => p.patient_id === oldAppointment.patient_id
        );
        if (doctorMatch) setSelectedDoctor(doctorMatch);
        if (patientMatch) setSelectedPatient(patientMatch);
      }
    };

    fetchData();
  }, [oldAppointment]);

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
    }
  }, [selectedDoctor, date, length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:6969/api/appointments/${id}`, {
        status: "Cancelled",
      });

      const fullDateTime = `${date}T${selectedTime}`;

      await axios.post("http://localhost:6969/api/appointments", {
        doctorId: selectedDoctor.staff_id,
        patientId: selectedPatient.patient_id,
        dateTime: fullDateTime,
        length: parseInt(length),
        status: "Scheduled",
      });

      navigate("/receptionist/appointments");
    } catch (err) {
      console.error("Rescheduling failed:", err);
      alert(
        "Failed to reschedule appointment: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleCancel = () => {
    navigate("/receptionist/appointments");
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
      <h2>Reschedule Appointment</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
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

        <label>New Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Length (minutes):</label>
        <select
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
        >
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={60}>60</option>
        </select>

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

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            disabled={!selectedDoctor || !selectedPatient || !selectedTime}
          >
            Cancel and Book New Appointment
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default RescheduleAppointment;
