import { useState } from "react";
import axios from "axios";

const TestForm = ({ patient_id, doctor_id, onSuccess }) => {
  const [form, setForm] = useState({
    date: "",
    test_name: "",
    result: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:6969/api/tests", {
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

      <label>Test Name:</label>
      <input
        name="test_name"
        value={form.test_name}
        onChange={handleChange}
        required
      />

      <label>Result:</label>
      <input
        name="result"
        value={form.result}
        onChange={handleChange}
        placeholder="Optional"
      />

      <button type="submit">Submit Test</button>
    </form>
  );
};

export default TestForm;
