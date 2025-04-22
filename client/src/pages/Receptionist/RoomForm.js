import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const RoomForm = () => {
  const { room_no } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(room_no);

  const [form, setForm] = useState({ room_no: "", type: "", capacity: "" });
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`http://localhost:6969/api/rooms/${room_no}`)
        .then((res) => setForm(res.data));
      axios
        .get(`http://localhost:6969/api/rooms/${room_no}/patients`)
        .then((res) => setAssignedPatients(res.data));
    }
    axios
      .get("http://localhost:6969/api/patients")
      .then((res) => setAllPatients(res.data));
  }, [room_no, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`http://localhost:6969/api/rooms/${room_no}`, form);
    } else {
      await axios.post("http://localhost:6969/api/rooms", form);
    }
    navigate("/receptionist/rooms");
  };

  const handleCancel = () => navigate("/receptionist/rooms");

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await axios.delete(`http://localhost:6969/api/rooms/${room_no}`);
      navigate("/receptionist/rooms");
    }
  };

  const handleAssignPatient = async (patient_id) => {
    await axios.post(`http://localhost:6969/api/rooms/${room_no}/patients`, {
      patient_id,
    });
    const res = await axios.get(
      `http://localhost:6969/api/rooms/${room_no}/patients`
    );
    setAssignedPatients(res.data);
  };

  const handleUnassignPatient = async (patient_id) => {
    await axios.delete(
      `http://localhost:6969/api/rooms/${room_no}/patients/${patient_id}`
    );
    const res = await axios.get(
      `http://localhost:6969/api/rooms/${room_no}/patients`
    );
    setAssignedPatients(res.data);
  };

  const availablePatients = allPatients.filter(
    (p) => !assignedPatients.some((a) => a.patient_id === p.patient_id)
  );

  const filteredPatients = availablePatients.filter((p) =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "1rem", maxWidth: "600px" }}>
      <h2>{isEdit ? "Edit Room" : "Add Room"}</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        {!isEdit && (
          <div>
            <label>Room Number:</label>
            <input
              name="room_no"
              value={form.room_no}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div>
          <label>Type:</label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Capacity:</label>
          <input
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button type="submit">{isEdit ? "Save Changes" : "Add Room"}</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              style={{ backgroundColor: "#cc3333", color: "white" }}
            >
              Delete Room
            </button>
          )}
        </div>
      </form>

      {isEdit && (
        <>
          <h3>Assigned Patients</h3>
          <ul>
            {assignedPatients.map((p) => (
              <li key={p.patient_id}>
                {p.first_name} {p.last_name}{" "}
                <button
                  onClick={() => handleUnassignPatient(p.patient_id)}
                  style={{ marginLeft: "1rem" }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <h3>Search & Assign Patient</h3>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }}
          />

          <ul
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "0.5rem",
            }}
          >
            {filteredPatients.map((p) => (
              <li
                key={p.patient_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.25rem",
                }}
              >
                <span>
                  {p.first_name} {p.last_name} (ID: {p.patient_id})
                </span>
                <button onClick={() => handleAssignPatient(p.patient_id)}>
                  Assign
                </button>
              </li>
            ))}
            {filteredPatients.length === 0 && (
              <li>No matching patients found.</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default RoomForm;
