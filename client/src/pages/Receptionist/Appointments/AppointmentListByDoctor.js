import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentListByDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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

  const getPatient = (id) => patients.find((p) => p.patient_id === id);

  const filteredDoctors = doctors.filter((d) =>
    `${d.first_name} ${d.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const doctorAppointments = selectedDoctor
    ? appointments.filter((a) => a.doctor_id === selectedDoctor.staff_id)
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
      <h2>Appointments by Doctor</h2>

      <label>Search Doctor:</label>
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
        {filteredDoctors.map((d) => (
          <li key={d.staff_id}>
            <button
              type="button"
              onClick={() => {
                setSelectedDoctor(d);
                setSearch(`${d.first_name} ${d.last_name}`);
              }}
            >
              {d.first_name} {d.last_name} (ID: {d.staff_id})
            </button>
          </li>
        ))}
      </ul>

      {selectedDoctor && (
        <>
          <h3>Appointments for Dr. {selectedDoctor.last_name}</h3>
          <ul>
            {doctorAppointments.map((a) => {
              const patient = getPatient(a.patient_id);
              return (
                <li key={a.appointment_id} style={{ marginBottom: "1rem" }}>
                  <strong>{new Date(a.date_time).toLocaleString()}</strong> (
                  {a.length} min)
                  <br />
                  Patient: {patient?.first_name} {patient?.last_name} (ID:{" "}
                  {a.patient_id})
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
            {doctorAppointments.length === 0 && <p>No appointments found.</p>}
          </ul>
        </>
      )}
    </div>
  );
};

export default AppointmentListByDoctor;
