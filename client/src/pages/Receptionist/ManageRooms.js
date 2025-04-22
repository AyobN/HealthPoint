import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res1 = await axios.get("http://localhost:6969/api/rooms");
    const res2 = await axios.get("http://localhost:6969/api/rooms/assignments");
    setRooms(res1.data);
    setAssignments(res2.data); // { room_no: count }
  };

  const getStatus = (room) => {
    const currentCount = assignments[room.room_no] || 0;
    return currentCount < room.capacity ? "Available" : "Occupied";
  };

  const filtered = rooms.filter((r) => {
    const matchesSearch = `${r.room_no} ${r.type} ${r.capacity}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const status = getStatus(r);
    const matchesStatus = !statusFilter || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Rooms</h2>

      <div style={{ marginBottom: "1rem" }}>
        <Link to="/receptionist/rooms/new">
          <button>Add Room</button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by room number, type, or capacity..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      >
        <option value="">All Statuses</option>
        <option value="Available">Available</option>
        <option value="Occupied">Occupied</option>
      </select>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((r) => (
          <li
            key={r.room_no}
            style={{
              border: "1px solid #ccc",
              marginBottom: "0.5rem",
              padding: "0.75rem",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div>
              <strong>Room {r.room_no}</strong>
              <br />
              <small>Type: {r.type}</small>
              <br />
              <small>Capacity: {r.capacity}</small>
              <br />
              <small>Status: {getStatus(r)}</small>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link to={`/receptionist/rooms/${r.room_no}/edit`}>
                <button>Manage</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageRooms;
