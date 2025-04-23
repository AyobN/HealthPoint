import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/rooms").then((res) => setRooms(res.data));
  }, []);

  const filtered = rooms.filter((r) =>
    `${r.room_no} ${r.type}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Rooms</h2>
      <Link to="/receptionist/rooms/new">
        <button>Add Room</button>
      </Link>

      <input
        type="text"
        placeholder="Search by room number or type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginTop: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((r) => (
          <li
            key={r.room_no}
            style={{
              border: "1px solid #ccc",
              padding: "0.75rem",
              marginBottom: "0.5rem",
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
            </div>
            <Link to={`/receptionist/rooms/${r.room_no}/edit`}>
              <button>Manage</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageRooms;
