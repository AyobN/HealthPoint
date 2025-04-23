import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";

const DoctorForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    license_no: "",
    specialty: "",
    schedule: {
      days: [],
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    if (isEdit) {
      API.get(`/doctors/${id}`).then((res) => {
        setForm({
          ...res.data,
          schedule: res.data.schedule
            ? JSON.parse(res.data.schedule)
            : {
                days: [],
                startTime: "",
                endTime: "",
              },
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleScheduleChange = (e) => {
    setForm({
      ...form,
      schedule: { ...form.schedule, [e.target.name]: e.target.value },
    });
  };

  const handleDaysChange = (day) => {
    const updated = form.schedule.days.includes(day)
      ? form.schedule.days.filter((d) => d !== day)
      : [...form.schedule.days, day];
    setForm({ ...form, schedule: { ...form.schedule, days: updated } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, schedule: JSON.stringify(form.schedule) };

    if (isEdit) {
      await API.put(`/doctors/${id}`, payload);
    } else {
      await API.post("/doctors", payload);
    }

    navigate("/receptionist/doctors");
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div style={{ padding: "1rem", maxWidth: "600px" }}>
      <h2>{isEdit ? "Edit Doctor" : "Add Doctor"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
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
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="license_no"
          placeholder="License Number"
          value={form.license_no}
          onChange={handleChange}
          required
        />
        <input
          name="specialty"
          placeholder="Specialty"
          value={form.specialty}
          onChange={handleChange}
          required
        />

        <label>
          <strong>Schedule</strong>
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {daysOfWeek.map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                checked={form.schedule.days.includes(day)}
                onChange={() => handleDaysChange(day)}
              />
              {day}
            </label>
          ))}
        </div>
        <input
          name="startTime"
          type="time"
          value={form.schedule.startTime}
          onChange={handleScheduleChange}
          required
        />
        <input
          name="endTime"
          type="time"
          value={form.schedule.endTime}
          onChange={handleScheduleChange}
          required
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit">
            {isEdit ? "Save Changes" : "Add Doctor"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/receptionist/doctors")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
