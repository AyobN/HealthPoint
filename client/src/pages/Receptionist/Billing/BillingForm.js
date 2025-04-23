import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api";

const BillingForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patient_id: "",
    amount: "",
    description: "",
    status: "Unpaid",
  });

  useEffect(() => {
    if (isEdit) {
      API.get(`/bills/${id}`).then((res) => setForm(res.data));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await API.put(`/bills/${id}`, form);
    } else {
      await API.post("/bills", form);
    }
    navigate("/receptionist/billing");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px" }}>
      <h2>{isEdit ? "Edit Bill" : "Create Bill"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          name="patient_id"
          placeholder="Patient ID"
          value={form.patient_id}
          onChange={handleChange}
          required
        />
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit">Save</button>
          <button
            type="button"
            onClick={() => navigate("/receptionist/billing")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingForm;
