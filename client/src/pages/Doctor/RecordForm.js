import { useState } from "react";
import axios from "axios";

const RecordForm = ({ patient_id, doctor_id, onSuccess }) => {
  const [form, setForm] = useState({
    date: "",
    symptoms: "",
    diagnosis: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:6969/api/records", {
      ...form,
      patient_id,
      doctor_id,
    });
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "1rem",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <label>Date:</label>
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <label>Symptoms:</label>
      <input
        name="symptoms"
        value={form.symptoms}
        onChange={handleChange}
        required
      />

      <label>Diagnosis:</label>
      <input
        name="diagnosis"
        value={form.diagnosis}
        onChange={handleChange}
        required
      />

      <label>Notes:</label>
      <textarea name="notes" value={form.notes} onChange={handleChange} />

      <button type="submit">Submit Record</button>
    </form>
  );
};

export default RecordForm;
