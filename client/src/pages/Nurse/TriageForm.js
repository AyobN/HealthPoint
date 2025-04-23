import { useState } from "react";
import API from "../../api";

const TriageForm = ({ patient_id, onSuccess }) => {
  const [form, setForm] = useState({
    bp: "",
    heart_rate: "",
    rating: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/triage", {
      ...form,
      patient_id,
    });
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <label>Blood Pressure (BP):</label>
      <input name="bp" value={form.bp} onChange={handleChange} required />

      <label>Heart Rate:</label>
      <input
        name="heart_rate"
        type="number"
        value={form.heart_rate}
        onChange={handleChange}
        required
      />

      <label>Rating:</label>
      <select
        name="rating"
        value={form.rating}
        onChange={handleChange}
        required
      >
        <option value="">Select...</option>
        <option value="Stable">Stable</option>
        <option value="Elevated">Elevated</option>
        <option value="Critical">Critical</option>
      </select>

      <button type="submit">Submit Triage</button>
    </form>
  );
};

export default TriageForm;
