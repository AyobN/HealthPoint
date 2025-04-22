const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6969;

app.use(cors());
app.use(express.json());

// Dummy tests
let nextTestId = 3;

let tests = [
  {
    test_id: 1,
    patient_id: 1,
    doctor_id: 1,
    labtech_id: null,
    date: "2024-06-05",
    test_name: "Blood Panel",
    result: "",
  },
  {
    test_id: 2,
    patient_id: 2,
    doctor_id: 2,
    labtech_id: 5,
    date: "2024-06-10",
    test_name: "X-ray",
    result: "Fracture detected",
  },
];

// Dummy records

let nextRecordId = 3;

let records = [
  {
    record_id: 1,
    patient_id: 1,
    doctor_id: 1,
    date: "2024-06-01",
    symptoms: "Cough, Fever",
    diagnosis: "Bronchitis",
    notes: "Prescribed antibiotics. Follow up in 2 weeks.",
  },
  {
    record_id: 2,
    patient_id: 2,
    doctor_id: 2,
    date: "2024-06-02",
    symptoms: "Headache, Nausea",
    diagnosis: "Migraine",
    notes: "Recommended hydration and rest.",
  },
];

// Dummy triage
let triageData = [
  { patient_id: 1, bp: "120/80", heart_rate: 72, rating: "Stable" },
  { patient_id: 2, bp: "140/90", heart_rate: 88, rating: "Elevated" },
  { patient_id: 1, bp: "115/75", heart_rate: 70, rating: "Stable" }, // multiple entries okay
];

// Dummy bills
let nextBillId = 3;

let bills = [
  {
    bill_id: 1,
    patient_id: 1,
    appointment_id: 1,
    amount: 150.0,
    status: "Unpaid",
    description: "Initial consultation",
    issued_date: "2024-05-01T10:00",
  },
  {
    bill_id: 2,
    patient_id: 2,
    appointment_id: 2,
    amount: 200.0,
    status: "Paid",
    description: "Follow-up exam",
    issued_date: "2024-05-03T11:00",
  },
];

// ========== Billing Routes ==========

// Get all bills
app.get("/api/bills", (req, res) => {
  res.json(bills);
});

// Get bills by patient ID
app.get("/api/bills/patient/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const patientBills = bills.filter((b) => b.patient_id === id);
  res.json(patientBills);
});

// Get single bill by bill ID
app.get("/api/bills/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bill = bills.find((b) => b.bill_id === id);
  if (!bill) return res.status(404).json({ message: "Bill not found" });
  res.json(bill);
});

// Create a new bill
app.post("/api/bills", (req, res) => {
  const {
    patient_id,
    appointment_id,
    amount,
    description,
    status = "Unpaid",
  } = req.body;

  if (!patient_id || !amount || !description) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const newBill = {
    bill_id: nextBillId++,
    patient_id,
    appointment_id: appointment_id || null,
    amount: parseFloat(amount),
    status,
    description,
    issued_date: new Date().toISOString(),
  };

  bills.push(newBill);
  res.json({ success: true, bill: newBill });
});

// Update a bill (e.g., mark as paid)
app.put("/api/bills/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = bills.findIndex((b) => b.bill_id === id);
  if (index === -1) return res.status(404).json({ message: "Bill not found" });

  bills[index] = { ...bills[index], ...req.body };
  res.json({ success: true, bill: bills[index] });
});

// Delete a bill (optional)
app.delete("/api/bills/:id", (req, res) => {
  const id = parseInt(req.params.id);
  bills = bills.filter((b) => b.bill_id !== id);
  res.json({ success: true });
});

// Dummy user login accounts
const users = [
  { id: 1, username: "patient1", password: "pass123", role: "patient" },
  { id: 2, username: "nurse1", password: "nurse123", role: "nurse" },
  { id: 3, username: "doctor1", password: "doc123", role: "doctor" },
  { id: 4, username: "reception1", password: "rec123", role: "receptionist" },
  { id: 5, username: "labtech1", password: "lab123", role: "labtechnician" },
];

let nextPatientId = 3;

let patients = [
  {
    patient_id: 1,
    username: "patient1",
    password: "pass123",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone: "555-1234",
    dob: "1990-01-01",
    gender: "Male",
    insurance: "Blue Cross",
    status: "outpatient",
    doctor_id: 1,
  },
  {
    patient_id: 2,
    username: "patient2",
    password: "pass456",
    first_name: "Alice",
    last_name: "Smith",
    email: "alice@example.com",
    phone: "555-5678",
    dob: "1985-07-15",
    gender: "Female",
    insurance: "Sun Life",
    status: "inpatient",
    doctor_id: 2,
  },
];

let nextStaffId = 3;

let doctors = [
  {
    staff_id: 1,
    username: "house",
    password: "doc123",
    license_no: "D12345",
    first_name: "Gregory",
    last_name: "House",
    email: "house@example.com",
    specialty: "Diagnostics",
    schedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "09:00",
      endTime: "17:00",
    },
    patients: [1],
  },
  {
    staff_id: 2,
    username: "wilson",
    password: "doc456",
    license_no: "D67890",
    first_name: "James",
    last_name: "Wilson",
    email: "wilson@example.com",
    specialty: "Oncology",
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      startTime: "10:00",
      endTime: "16:00",
    },
    patients: [2],
  },
];

let nurses = [
  {
    staff_id: 3,
    username: "nursejoy",
    password: "nurse123",
    first_name: "Joy",
    last_name: "Smith",
    email: "nurse.joy@example.com",
  },
];

let labtechs = [
  {
    staff_id: 5,
    username: "labtech1",
    password: "lab123",
    first_name: "Leo",
    last_name: "Green",
    email: "leo.green@hospital.com",
  },
];

// Dummy lab techs
let receptionists = [
  {
    staff_id: 4,
    username: "reception1",
    password: "rec123",
    first_name: "Emma",
    last_name: "Brown",
    email: "emma.brown@hospital.com",
  },
];

// Dummy appointments
let appointments = [];

// Dummy rooms
let rooms = [
  { room_no: 101, type: "ICU", capacity: 1 },
  { room_no: 202, type: "Ward", capacity: 2 },
];

// Dummy room assignment
let roomAssignments = [
  { room_no: 101, patient_id: 2 }, // Alice is in Room 101
];

app.get("/api/roomassignments", (req, res) => {
  res.json(roomAssignments);
});

app.post("/api/patients/:id/admit", (req, res) => {
  const id = parseInt(req.params.id);
  const patient = patients.find((p) => p.patient_id === id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });

  if (patient.status === "inpatient") {
    return res.status(400).json({ message: "Patient is already admitted." });
  }

  // Find available room
  const getOccupancy = (room_no) =>
    roomAssignments.filter((r) => r.room_no === room_no).length;

  let availableRoom = rooms.find(
    (r) => r.type === "Waiting Room" && getOccupancy(r.room_no) < r.capacity
  );

  if (!availableRoom) {
    availableRoom = rooms.find((r) => getOccupancy(r.room_no) < r.capacity);
  }

  if (!availableRoom) {
    return res.status(400).json({ message: "No rooms available." });
  }

  roomAssignments.push({ room_no: availableRoom.room_no, patient_id: id });
  patient.status = "inpatient";

  if (!patient.doctor_id) {
    const availableDoctors = doctors.filter(
      (d) => !d.patients.includes(patient.patient_id)
    );
    if (availableDoctors.length === 0) {
      return res
        .status(400)
        .json({ message: "No doctors available to assign." });
    }

    const randomDoctor =
      availableDoctors[Math.floor(Math.random() * availableDoctors.length)];
    patient.doctor_id = randomDoctor.staff_id;

    if (!randomDoctor.patients.includes(patient.patient_id)) {
      randomDoctor.patients.push(patient.patient_id);
    }
  }

  res.json({ success: true, room_no: availableRoom.room_no });
});

app.get("/api/rooms/assignments", (req, res) => {
  const counts = {};

  roomAssignments.forEach(({ room_no }) => {
    counts[room_no] = (counts[room_no] || 0) + 1;
  });

  res.json(counts);
});

app.post("/api/patients/:id/discharge", (req, res) => {
  const id = parseInt(req.params.id);
  const patient = patients.find((p) => p.patient_id === id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });

  if (patient.status !== "inpatient") {
    return res
      .status(400)
      .json({ message: "Patient is not currently admitted." });
  }

  roomAssignments = roomAssignments.filter((r) => r.patient_id !== id);
  patient.status = "outpatient";

  res.json({ success: true });
});

// ===================
// LOGIN ROUTE
// ===================
app.post("/api/login", (req, res) => {
  const { username, password, loginType } = req.body;

  if (loginType === "patient") {
    const patient = patients.find(
      (p) => p.username === username && p.password === password
    );
    if (!patient)
      return res.status(401).json({ message: "Invalid credentials" });

    return res.json({
      success: true,
      userId: patient.patient_id,
      role: "patient",
      username: patient.username,
    });
  }

  if (loginType === "staff") {
    const check = (arr, role) => {
      const match = arr.find(
        (u) => u.username === username && u.password === password
      );
      return match ? { match, role } : null;
    };

    const results = [
      check(doctors, "doctor"),
      check(nurses, "nurse"),
      check(receptionists, "receptionist"),
      check(labtechs, "labtechnician"),
    ];

    const found = results.find((r) => r !== null);

    if (!found) return res.status(401).json({ message: "Invalid credentials" });

    return res.json({
      success: true,
      userId: found.match.staff_id,
      role: found.role,
      username: found.match.username,
    });
  }

  return res.status(400).json({ message: "Invalid login type" });
});

// ===================
// PATIENT ROUTES
// ===================
app.get("/api/patients", (req, res) => {
  res.json(patients);
});

app.get("/api/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const patient = patients.find((p) => p.patient_id === id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
});

app.post("/api/patients", (req, res) => {
  const { first_name, last_name, email, phone, dob, gender, insurance } =
    req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !insurance
  ) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newPatient = {
    patient_id: nextPatientId++,
    first_name,
    last_name,
    email,
    phone,
    dob,
    gender,
    insurance,
  };

  patients.push(newPatient);
  res.json({ success: true, patient: newPatient });
});

app.put("/api/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = patients.findIndex((p) => p.patient_id === id);
  if (index === -1)
    return res.status(404).json({ message: "Patient not found" });

  patients[index] = { ...patients[index], ...req.body };
  res.json({ success: true, patient: patients[index] });
});

app.delete("/api/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);
  patients = patients.filter((p) => p.patient_id !== id);
  res.json({ success: true });
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

app.get("/api/doctors/:id/schedule", (req, res) => {
  const id = parseInt(req.params.id);
  const doctor = doctors.find((d) => d.staff_id === id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor.schedule);
});

app.get("/api/doctors/:id/availability", (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { date, length } = req.query;

  if (!date || !length) {
    return res.status(400).json({ message: "Missing date or length." });
  }

  const doctor = doctors.find((d) => d.staff_id === doctorId);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const dayName = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });
  if (!doctor.schedule.days.includes(dayName)) {
    return res.json([]); // Doctor not working that day
  }

  const [sh, sm] = doctor.schedule.startTime.split(":").map(Number);
  const [eh, em] = doctor.schedule.endTime.split(":").map(Number);
  const scheduleStart = sh * 60 + sm;
  const scheduleEnd = eh * 60 + em;
  const step = parseInt(length);

  // Generate all possible time slots
  const slots = [];
  for (let time = scheduleStart; time + step <= scheduleEnd; time += step) {
    slots.push(time);
  }

  // Get this doctor's appointments for that date
  const dayAppointments = appointments.filter(
    (a) =>
      a.doctorId === doctorId &&
      a.status !== "Cancelled" &&
      a.dateTime.startsWith(date)
  );

  const isOverlapping = (slotStart) => {
    const slotEnd = slotStart + step;

    return dayAppointments.some((a) => {
      const aStart = new Date(a.dateTime);
      const aStartMin = aStart.getHours() * 60 + aStart.getMinutes();
      const aEndMin = aStartMin + a.length;

      return !(slotEnd <= aStartMin || slotStart >= aEndMin);
    });
  };

  const availableSlots = slots
    .filter((t) => !isOverlapping(t))
    .map((t) => {
      const hour = Math.floor(t / 60)
        .toString()
        .padStart(2, "0");
      const minute = (t % 60).toString().padStart(2, "0");
      return `${hour}:${minute}`;
    });

  res.json(availableSlots);
});

app.get("/api/doctors/:id/patients", (req, res) => {
  const id = parseInt(req.params.id);
  const doctor = doctors.find((d) => d.staff_id === id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const doctorPatients = patients.filter((p) =>
    doctor.patients.includes(p.patient_id)
  );
  res.json(doctorPatients);
});

// ===================
// APPOINTMENT ROUTES
// ===================
app.get("/api/appointments", (req, res) => {
  res.json(appointments);
});

app.post("/api/appointments", (req, res) => {
  const {
    patientId,
    doctorId,
    dateTime,
    length,
    status = "Scheduled",
  } = req.body;

  if (!patientId || !doctorId || !dateTime || !length) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const doctor = doctors.find((d) => d.staff_id === doctorId);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const dt = new Date(dateTime);
  const dayName = dt.toLocaleDateString("en-US", { weekday: "long" });
  const time = dt.toTimeString().slice(0, 5); // "HH:MM"

  // Validate against doctor's working days
  if (!doctor.schedule.days.includes(dayName)) {
    return res
      .status(400)
      .json({ message: "Doctor not available on this day." });
  }

  // Validate time range
  const [h, m] = time.split(":").map(Number);
  const [sh, sm] = doctor.schedule.startTime.split(":").map(Number);
  const [eh, em] = doctor.schedule.endTime.split(":").map(Number);

  const appointmentStart = h * 60 + m;
  const appointmentEnd = appointmentStart + parseInt(length);
  const scheduleStart = sh * 60 + sm;
  const scheduleEnd = eh * 60 + em;

  if (appointmentStart < scheduleStart || appointmentEnd > scheduleEnd) {
    return res
      .status(400)
      .json({ message: "Time is outside doctor's working hours." });
  }

  // Check for overlapping appointments
  const conflict = appointments.find(
    (a) =>
      a.doctorId === doctorId &&
      a.status !== "Cancelled" &&
      Math.abs(new Date(a.dateTime) - dt) < a.length * 60000
  );

  if (conflict) {
    return res
      .status(400)
      .json({ message: "Doctor already has an appointment at this time." });
  }

  const newAppointment = {
    id: appointments.length + 1,
    patientId,
    doctorId,
    dateTime,
    length: parseInt(length),
    status,
  };

  appointments.push(newAppointment);
  res.json({ success: true, appointment: newAppointment });
});

app.put("/api/appointments/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1)
    return res.status(404).json({ message: "Appointment not found" });

  appointments[index] = { ...appointments[index], ...req.body };
  res.json({ success: true, appointment: appointments[index] });
});

app.get("/api/doctors/:id/appointments", (req, res) => {
  const doctorId = parseInt(req.params.id);
  const doctorAppointments = appointments.filter(
    (a) => a.doctorId === doctorId
  );
  res.json(doctorAppointments);
});

// Room routes

app.get("/api/rooms", (req, res) => {
  res.json(rooms);
});

app.get("/api/rooms/:room_no", (req, res) => {
  const roomNo = parseInt(req.params.room_no);
  const room = rooms.find((r) => r.room_no === roomNo);
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
});

app.post("/api/rooms", (req, res) => {
  const { room_no, type, capacity } = req.body;
  if (!room_no || !type || !capacity) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const exists = rooms.find((r) => r.room_no === parseInt(room_no));
  if (exists) return res.status(409).json({ message: "Room already exists" });

  const newRoom = {
    room_no: parseInt(room_no),
    type,
    capacity: parseInt(capacity),
  };
  rooms.push(newRoom);
  res.json({ success: true, room: newRoom });
});

app.put("/api/rooms/:room_no", (req, res) => {
  const roomNo = parseInt(req.params.room_no);
  const index = rooms.findIndex((r) => r.room_no === roomNo);
  if (index === -1) return res.status(404).json({ message: "Room not found" });

  const updated = { ...rooms[index], ...req.body };
  rooms[index] = updated;
  res.json({ success: true, room: updated });
});

app.delete("/api/rooms/:room_no", (req, res) => {
  const roomNo = parseInt(req.params.room_no);
  rooms = rooms.filter((r) => r.room_no !== roomNo);
  res.json({ success: true });
});

// Get all patients in a room
app.get("/api/rooms/:room_no/patients", (req, res) => {
  const roomNo = parseInt(req.params.room_no);
  const assignedPatientIds = roomAssignments
    .filter((a) => a.room_no === roomNo)
    .map((a) => a.patient_id);

  const assignedPatients = patients.filter((p) =>
    assignedPatientIds.includes(p.patient_id)
  );
  res.json(assignedPatients);
});

// Assign a patient to a room
app.post("/api/rooms/:room_no/patients", (req, res) => {
  const roomNo = parseInt(req.params.room_no);
  const { patient_id } = req.body;

  if (!patient_id)
    return res.status(400).json({ message: "Missing patient_id" });

  const alreadyAssigned = roomAssignments.find(
    (a) => a.room_no === roomNo && a.patient_id === patient_id
  );
  if (alreadyAssigned)
    return res.status(409).json({ message: "Already assigned" });

  roomAssignments.push({ room_no: roomNo, patient_id });
  res.json({ success: true });
});

// Unassign patient from a room
app.delete("/api/rooms/:room_no/patients/:patient_id", (req, res) => {
  const roomNo = parseInt(req.params.room_no);
  const patientId = parseInt(req.params.patient_id);

  roomAssignments = roomAssignments.filter(
    (a) => !(a.room_no === roomNo && a.patient_id === patientId)
  );

  res.json({ success: true });
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

// Triage routes
app.get("/api/triage", (req, res) => {
  res.json(triageData);
});

app.post("/api/triage", (req, res) => {
  const { patient_id, bp, heart_rate, rating } = req.body;

  if (!patient_id || !bp || !heart_rate || !rating) {
    return res.status(400).json({ message: "Missing fields." });
  }

  const newTriage = { patient_id, bp, heart_rate, rating };
  triageData.push(newTriage);
  res.json({ success: true, triage: newTriage });
});

// ========== Patient Records API ==========

// Get all records
app.get("/api/records", (req, res) => {
  res.json(records);
});

// Get records by patient ID
app.get("/api/records/patient/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const result = records.filter((r) => r.patient_id === id);
  res.json(result);
});

// Add a new patient record
app.post("/api/records", (req, res) => {
  const { patient_id, doctor_id, date, symptoms, diagnosis, notes } = req.body;

  if (!patient_id || !doctor_id || !date || !symptoms || !diagnosis) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newRecord = {
    record_id: nextRecordId++,
    patient_id,
    doctor_id,
    date,
    symptoms,
    diagnosis,
    notes,
  };

  records.push(newRecord);
  res.json({ success: true, record: newRecord });
});

// ========== Patient Tests API ==========

// Get all tests
app.get("/api/tests", (req, res) => {
  res.json(tests);
});

// Get tests by patient ID
app.get("/api/tests/patient/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const result = tests.filter((t) => t.patient_id === id);
  res.json(result);
});

// Add a test
app.post("/api/tests", (req, res) => {
  const { patient_id, doctor_id, date, test_name, result } = req.body;

  //console.log("TEST SUBMISSION:", req.body);

  if (!patient_id || !doctor_id || !date || !test_name) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const newTest = {
    test_id: nextTestId++,
    patient_id,
    doctor_id,
    date,
    test_name,
    result: result || "Pending",
  };

  tests.push(newTest);
  res.json({ success: true, test: newTest });
});

// Get all tests with no result (pending)
app.get("/api/tests/pending", (req, res) => {
  const pending = tests.filter((t) => !t.result || t.result.trim() === "");
  res.json(pending);
});

// Get all completed tests
app.get("/api/tests/completed", (req, res) => {
  const done = tests.filter((t) => t.result && t.result.trim() !== "");
  res.json(done);
});

// Update a test result + assign labtech_id
app.put("/api/tests/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { result, labtech_id } = req.body;

  const index = tests.findIndex((t) => t.test_id === id);
  if (index === -1) return res.status(404).json({ message: "Test not found" });

  if (!result || !labtech_id) {
    return res.status(400).json({ message: "Missing result or labtech_id" });
  }

  tests[index].result = result;
  tests[index].labtech_id = labtech_id;

  res.json({ success: true, test: tests[index] });
});
