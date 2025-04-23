import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api";

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    username: "",
    password: "",
    patient_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    insurance: "",
    status: "outpatient",
    doctor_id: "",
  });

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    API.get("/doctors").then((res) => setDoctors(res.data));

    if (isEdit) {
      API.get(`/patients/${id}`).then((res) => setForm(res.data));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      await API.put(`/patients/${id}`, form);
    } else {
      await API.post("/patients", form);
    }

    navigate("/receptionist/patients");
  };

  const handleCancel = () => {
    navigate("/receptionist/patients");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;
    await API.delete(`/patients/${id}`);
    navigate("/receptionist/patients");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px" }}>
      <h2>{isEdit ? "Edit Patient" : "Add Patient"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        {!isEdit && (
          <>
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </>
        )}
        <div>
          <label>First Name:</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>
        </div>
        <div>
          <label>Insurance:</label>
          <input
            name="insurance"
            value={form.insurance}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Doctor:</label>
          <select
            name="doctor_id"
            value={form.doctor_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map((d) => (
              <option key={d.staff_id} value={d.staff_id}>
                {d.first_name} {d.last_name} (ID: {d.staff_id})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button type="submit">
            {isEdit ? "Save Changes" : "Add Patient"}
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              style={{ backgroundColor: "#cc3333", color: "white" }}
            >
              Delete Patient
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
