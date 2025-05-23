import { useState } from "react";
import axios from "axios";

const TestResultForm = ({ test_id, labtech_id, onSuccess }) => {
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:6969/api/tests/${test_id}`, {
      result,
      labtech_id,
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
      <label>Result:</label>
      <input
        value={result}
        onChange={(e) => setResult(e.target.value)}
        required
      />
      <button type="submit">Submit Result</button>
    </form>
  );
};

export default TestResultForm;
