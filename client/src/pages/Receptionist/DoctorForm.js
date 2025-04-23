import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    staff_id: "",
    license_no: "",
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    specialty: "",
  });

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`http://localhost:6969/api/doctors/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error("Doctor not found"));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`http://localhost:6969/api/doctors/${id}`, form);
    } else {
      await axios.post("http://localhost:6969/api/doctors", form);
    }
    navigate("/receptionist/doctors");
  };

  const handleCancel = () => {
    navigate("/receptionist/doctors");
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );
    if (!confirmed) return;

    await axios.delete(`http://localhost:6969/api/doctors/${id}`);
    navigate("/receptionist/doctors");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "500px" }}>
      <h2>{isEdit ? "Edit Doctor" : "Add Doctor"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        {isEdit && (
          <div>
            <label>Staff ID:</label>
            <input name="staff_id" value={form.staff_id} disabled />
          </div>
        )}
        <div>
          <label>License No:</label>
          <input
            name="license_no"
            value={form.license_no}
            onChange={handleChange}
            required
          />
        </div>
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
          <label>Username:</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Specialty:</label>
          <input
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button type="submit">
            {isEdit ? "Save Changes" : "Add Doctor"}
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
              Delete Doctor
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
