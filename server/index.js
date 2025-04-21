// server/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy users for testing
const users = [
  { id: 1, username: "patient1", password: "pass123", role: "patient" },
  { id: 2, username: "nurse1", password: "nurse123", role: "nurse" },
  { id: 3, username: "doctor1", password: "doc123", role: "doctor" },
  { id: 4, username: "reception1", password: "rec123", role: "receptionist" },
  { id: 5, username: "labtech1", password: "lab123", role: "labtechnician" },
];

const patients = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Alice Smith" },
];

const doctors = [
  { id: 1, name: "Dr. House" },
  { id: 2, name: "Dr. Wilson" },
];

const appointments = []; // Temporary in-memory store

// Login route
app.post("/api/login", (req, res) => {
  const { username, password, loginType } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  if (loginType === "patient" && user.role !== "patient") {
    return res
      .status(403)
      .json({ success: false, message: "Not a patient login." });
  }

  if (loginType === "staff" && user.role === "patient") {
    return res
      .status(403)
      .json({ success: false, message: "Not a staff login." });
  }

  res.json({ success: true, userId: user.id, role: user.role });
});

app.get("/api/patients", (req, res) => {
  res.json(patients);
});

app.get("/api/doctors", (req, res) => {
  res.json(doctors);
});

app.post("/api/appointments", (req, res) => {
  const { patientId, doctorId, dateTime } = req.body;

  if (!patientId || !doctorId || !dateTime) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  const newAppointment = {
    id: appointments.length + 1,
    patientId,
    doctorId,
    dateTime,
  };

  appointments.push(newAppointment);
  res.json({ success: true, appointment: newAppointment });
});

app.get("/api/appointments", (req, res) => {
  res.json(appointments);
});

// Ping route
app.get("/", (req, res) => {
  res.send("Hospital backend running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
