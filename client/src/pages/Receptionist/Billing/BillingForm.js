import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BillingForm = () => {
  const { id } = useParams(); // optional bill_id for edit
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patient_id: "",
    appointment_id: "",
    amount: "",
    status: "Unpaid",
    description: "",
  });

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:6969/api/patients")
      .then((res) => setPatients(res.data));
    axios
      .get("http://localhost:6969/api/appointments")
      .then((res) => setAppointments(res.data));

    if (isEdit) {
      axios.get(`http://localhost:6969/api/bills/${id}`).then((res) => {
        setForm(res.data);
        setSelectedPatient(res.data.patient_id);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePatientSelect = (p) => {
    setSelectedPatient(p.patient_id);
    setPatientSearch(`${p.first_name} ${p.last_name}`);
    setForm({ ...form, patient_id: p.patient_id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patient_id || !form.amount || !form.description) {
      return alert("Missing required fields");
    }

    // 🛠 Clean values for submission
    const { issued_date, ...cleanForm } = form;

    const submission = {
      ...cleanForm,
      amount: Number(cleanForm.amount),
      appointment_id: cleanForm.appointment_id
        ? Number(cleanForm.appointment_id)
        : null,
    };

    try {
      if (isEdit) {
        await axios.put(`http://localhost:6969/api/bills/${id}`, submission);
      } else {
        await axios.post("http://localhost:6969/api/bills", submission);
      }

      navigate("/receptionist/billing");
    } catch (err) {
      console.error("Billing error:", err);
      alert(
        "Failed to save bill: " + (err.response?.data?.error || err.message)
      );
    }
  };

  const handleCancel = () => {
    navigate("/receptionist/billing");
  };

  const filteredPatients = patients.filter((p) =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(patientSearch.toLowerCase())
  );

  return (
    <div style={{ padding: "1rem", maxWidth: "600px" }}>
      <h2>{isEdit ? "Edit Bill" : "Create Bill"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {!isEdit ? (
          <div>
            <label>Search Patient:</label>
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              required
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
                  <button type="button" onClick={() => handlePatientSelect(p)}>
                    {p.first_name} {p.last_name} (ID: {p.patient_id})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <label>Patient:</label>
            <p>{form.patient_id ? `ID: ${form.patient_id}` : "Unknown"}</p>
          </div>
        )}

        <div>
          <label>Link to Appointment (optional):</label>
          <select
            name="appointment_id"
            value={form.appointment_id}
            onChange={handleChange}
          >
            <option value="">None</option>
            {appointments.map((a) => (
              <option key={a.appointment_id} value={a.appointment_id}>
                #{a.appointment_id} – {new Date(a.date_time).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Amount:</label>
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Status:</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit">
            {isEdit ? "Save Changes" : "Create Bill"}
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingForm;
