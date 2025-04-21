const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6969;

app.use(cors());
app.use(express.json());

// Dummy user login accounts
const users = [
  { id: 1, username: "patient1", password: "pass123", role: "patient" },
  { id: 2, username: "nurse1", password: "nurse123", role: "nurse" },
  { id: 3, username: "doctor1", password: "doc123", role: "doctor" },
  { id: 4, username: "reception1", password: "rec123", role: "receptionist" },
  { id: 5, username: "labtech1", password: "lab123", role: "labtechnician" },
];

// Dummy patients
const patients = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Alice Smith" },
];

let nextStaffId = 3;

let doctors = [
  {
    staff_id: 1,
    license_no: "D12345",
    first_name: "Gregory",
    last_name: "House",
    email: "house@example.com",
    username: "house",
    password: "doc123",
    specialty: "Diagnostics",
  },
  {
    staff_id: 2,
    license_no: "D67890",
    first_name: "James",
    last_name: "Wilson",
    email: "wilson@example.com",
    username: "wilson",
    password: "doc123",
    specialty: "Oncology",
  },
];

// Dummy appointments
let appointments = [];

// ===================
// LOGIN ROUTE
// ===================
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

// ===================
// PATIENT ROUTES
// ===================
app.get("/api/patients", (req, res) => {
  res.json(patients);
});

// ===================
// DOCTOR ROUTES
// ===================
app.get("/api/doctors", (req, res) => {
  res.json(doctors);
});

app.get("/api/doctors/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const doctor = doctors.find((d) => d.staff_id === id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
});

app.post("/api/doctors", (req, res) => {
  const {
    license_no,
    first_name,
    last_name,
    email,
    username,
    password,
    specialty,
  } = req.body;

  if (
    !license_no ||
    !first_name ||
    !last_name ||
    !email ||
    !username ||
    !password ||
    !specialty
  ) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const newDoctor = {
    staff_id: nextStaffId++,
    license_no,
    first_name,
    last_name,
    email,
    username,
    password,
    specialty,
  };

  doctors.push(newDoctor);
  res.json({ success: true, doctor: newDoctor });
});

app.put("/api/doctors/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = doctors.findIndex((d) => d.staff_id === id);
  if (index === -1)
    return res.status(404).json({ message: "Doctor not found" });

  const updated = { ...doctors[index], ...req.body };
  doctors[index] = updated;
  res.json({ success: true, doctor: updated });
});

app.delete("/api/doctors/:id", (req, res) => {
  const id = parseInt(req.params.id);
  doctors = doctors.filter((d) => d.staff_id !== id);
  res.json({ success: true });
});

// ===================
// APPOINTMENT ROUTES
// ===================
app.get("/api/appointments", (req, res) => {
  res.json(appointments);
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

app.get("/api/doctors/:id/appointments", (req, res) => {
  const doctorId = parseInt(req.params.id);
  const doctorAppointments = appointments.filter(
    (a) => a.doctorId === doctorId
  );
  res.json(doctorAppointments);
});

// ===================
// ROOT ROUTE
// ===================
app.get("/", (req, res) => {
  res.send("Hospital backend running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
