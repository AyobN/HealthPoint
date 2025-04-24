import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentListByPatient = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [aRes, dRes, pRes] = await Promise.all([
      axios.get("http://localhost:6969/api/appointments"),
      axios.get("http://localhost:6969/api/doctors"),
      axios.get("http://localhost:6969/api/patients"),
    ]);
    setAppointments(aRes.data);
    setDoctors(dRes.data);
    setPatients(pRes.data);
  };

  const getDoctor = (id) => doctors.find((d) => d.staff_id === id);

  const filteredPatients = patients.filter((p) =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const patientAppointments = selectedPatient
    ? appointments.filter((a) => a.patient_id === selectedPatient.patient_id)
    : [];

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    await axios.put(`http://localhost:6969/api/appointments/${id}`, {
      status: "Cancelled",
    });
    fetchData();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Appointments by Patient</h2>

      <label>Search Patient:</label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name..."
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
                setSearch(`${p.first_name} ${p.last_name}`);
              }}
            >
              {p.first_name} {p.last_name} (ID: {p.patient_id})
            </button>
          </li>
        ))}
      </ul>

      {selectedPatient && (
        <>
          <h3>
            Appointments for {selectedPatient.first_name}{" "}
            {selectedPatient.last_name}
          </h3>
          <ul>
            {patientAppointments.map((a) => {
              const doctor = getDoctor(a.doctor_id);
              return (
                <li key={a.appointment_id} style={{ marginBottom: "1rem" }}>
                  <strong>{new Date(a.date_time).toLocaleString()}</strong> (
                  {a.length} min)
                  <br />
                  Doctor: {doctor?.first_name} {doctor?.last_name} (ID:{" "}
                  {a.doctor_id})
                  <br />
                  Status: {a.status}
                  <br />
                  <button
                    onClick={() =>
                      navigate(
                        `/receptionist/appointments/reschedule/${a.appointment_id}`,
                        { state: { appointment: a } }
                      )
                    }
                  >
                    Reschedule
                  </button>
                  {a.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancel(a.appointment_id)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      Cancel
                    </button>
                  )}
                </li>
              );
            })}
            {patientAppointments.length === 0 && <p>No appointments found.</p>}
          </ul>
        </>
      )}
    </div>
  );
};

export default AppointmentListByPatient;
