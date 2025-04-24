import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6969;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "healthpoint",
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

// ===================
// PATIENT ROUTES
// ===================
app.get("/api/patients", (req, res) => {
  db.query("SELECT * FROM Patient", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/patients/:id", (req, res) => {
  db.query(
    "SELECT * FROM Patient WHERE patient_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Patient not found" });
      res.json(results[0]);
    }
  );
});

app.post("/api/patients", (req, res) => {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    phone,
    dob,
    gender,
    insurance,
    status,
    doctor_id,
  } = req.body;
  db.query(
    "INSERT INTO Patient (username, password, first_name, last_name, email, phone, dob, gender, insurance, status, doctor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      username,
      password,
      first_name,
      last_name,
      email,
      phone,
      dob,
      gender,
      insurance,
      status || "outpatient",
      doctor_id || null,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, patient_id: result.insertId });
    }
  );
});

app.put("/api/patients/:id", (req, res) => {
  db.query(
    "UPDATE Patient SET ? WHERE patient_id = ?",
    [req.body, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete("/api/patients/:id", (req, res) => {
  db.query(
    "DELETE FROM Patient WHERE patient_id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Admit a patient (assigns room and sets status)
app.post("/api/patients/:id/admit", (req, res) => {
  const id = parseInt(req.params.id);
  db.query(
    "SELECT * FROM Patient WHERE patient_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Patient not found" });

      const patient = results[0];
      if (patient.status === "inpatient") {
        return res
          .status(400)
          .json({ message: "Patient is already admitted." });
      }

      db.query(
        `SELECT r.room_no, r.type FROM Room r
       LEFT JOIN RoomAssignment ra ON r.room_no = ra.room_no
       GROUP BY r.room_no
       HAVING COUNT(ra.patient_id) < r.capacity`,
        [],
        (err2, rooms) => {
          if (err2) return res.status(500).json({ error: err2.message });
          if (rooms.length === 0)
            return res.status(400).json({ message: "No rooms available." });

          const preferred =
            rooms.find((r) => r.type === "Waiting Room") || rooms[0];

          db.query(
            "INSERT INTO RoomAssignment (room_no, patient_id) VALUES (?, ?)",
            [preferred.room_no, id],
            (err3) => {
              if (err3) return res.status(500).json({ error: err3.message });

              db.query(
                "UPDATE Patient SET status = 'inpatient' WHERE patient_id = ?",
                [id],
                (err4) => {
                  if (err4)
                    return res.status(500).json({ error: err4.message });
                  res.json({ success: true, room_no: preferred.room_no });
                }
              );
            }
          );
        }
      );
    }
  );
});

// Discharge a patient (removes room + sets outpatient)
app.post("/api/patients/:id/discharge", (req, res) => {
  const id = parseInt(req.params.id);
  db.query(
    "SELECT * FROM Patient WHERE patient_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Patient not found" });

      const patient = results[0];
      if (patient.status !== "inpatient") {
        return res
          .status(400)
          .json({ message: "Patient is not currently admitted." });
      }

      db.query(
        "DELETE FROM RoomAssignment WHERE patient_id = ?",
        [id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          db.query(
            "UPDATE Patient SET status = 'outpatient' WHERE patient_id = ?",
            [id],
            (err3) => {
              if (err3) return res.status(500).json({ error: err3.message });
              res.json({ success: true });
            }
          );
        }
      );
    }
  );
});

// ===================
// DOCTOR ROUTES
// ===================

app.get("/api/doctors/:id/patients", (req, res) => {
  const doctorId = parseInt(req.params.id);

  db.query(
    "SELECT * FROM Patient WHERE doctor_id = ?",
    [doctorId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Get all doctors
app.get("/api/doctors", (req, res) => {
  const query = `
    SELECT s.staff_id, s.username, s.first_name, s.last_name, s.email, s.role,
           d.specialty, d.license_no, d.schedule
    FROM Staff s
    JOIN Doctor d ON s.staff_id = d.staff_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get doctor by ID
app.get("/api/doctors/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT s.*, d.license_no, d.specialty, d.schedule
    FROM Staff s
    JOIN Doctor d ON s.staff_id = d.staff_id
    WHERE s.staff_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Doctor not found" });
    res.json(results[0]);
  });
});

// Get doctor schedule
app.get("/api/doctors/:id/schedule", (req, res) => {
  const id = parseInt(req.params.id);
  db.query(
    "SELECT schedule FROM Doctor WHERE staff_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Doctor not found" });

      const schedule = JSON.parse(results[0].schedule || "{}");
      res.json(schedule);
    }
  );
});

// Get doctor availability for a given day + time slot
app.get("/api/doctors/:id/availability", (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { date, length } = req.query;

  if (!date || !length) {
    return res.status(400).json({ message: "Missing date or length." });
  }

  const scheduleQuery = "SELECT schedule FROM Doctor WHERE staff_id = ?";
  db.query(scheduleQuery, [doctorId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Doctor not found" });

    const schedule = JSON.parse(results[0].schedule);
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!schedule.days.includes(dayName)) return res.json([]);

    const [sh, sm] = schedule.startTime.split(":").map(Number);
    const [eh, em] = schedule.endTime.split(":").map(Number);
    const scheduleStart = sh * 60 + sm;
    const scheduleEnd = eh * 60 + em;
    const step = parseInt(length);

    const allSlots = [];
    for (let time = scheduleStart; time + step <= scheduleEnd; time += step) {
      const hour = String(Math.floor(time / 60)).padStart(2, "0");
      const minute = String(time % 60).padStart(2, "0");
      allSlots.push({ minutes: time, label: `${hour}:${minute}` });
    }

    db.query(
      "SELECT * FROM Appointment WHERE doctor_id = ? AND DATE(date_time) = ? AND status != 'Cancelled'",
      [doctorId, date],
      (err2, appointments) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const unavailable = appointments.map((a) => {
          const start = new Date(a.date_time);
          const startMin = start.getHours() * 60 + start.getMinutes();
          const endMin = startMin + a.length;
          return [startMin, endMin];
        });

        const isAvailable = (start) => {
          const end = start + step;
          return !unavailable.some(([s, e]) => !(end <= s || start >= e));
        };

        const availableSlots = allSlots
          .filter((s) => isAvailable(s.minutes))
          .map((s) => s.label);

        res.json(availableSlots);
      }
    );
  });
});

// add new doc
app.post("/api/doctors", (req, res) => {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    license_no,
    specialty,
  } = req.body;

  db.query(
    "INSERT INTO Staff (username, password, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?, 'doctor')",
    [username, password, first_name, last_name, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const staffId = result.insertId;

      const defaultSchedule = JSON.stringify({
        days: ["Monday", "Wednesday", "Friday"],
        startTime: "09:00",
        endTime: "17:00",
      });

      db.query(
        "INSERT INTO Doctor (staff_id, license_no, specialty, schedule) VALUES (?, ?, ?, ?)",
        [staffId, license_no, specialty, defaultSchedule],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ success: true, staff_id: staffId });
        }
      );
    }
  );
});

// edit doctor
app.put("/api/doctors/:id", (req, res) => {
  const staffId = req.params.id;
  const {
    first_name,
    last_name,
    email,
    username,
    password,
    license_no,
    specialty,
  } = req.body;

  db.query(
    "UPDATE Staff SET username = ?, password = ?, first_name = ?, last_name = ?, email = ? WHERE staff_id = ?",
    [username, password, first_name, last_name, email, staffId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(
        "UPDATE Doctor SET license_no = ?, specialty = ? WHERE staff_id = ?",
        [license_no, specialty, staffId],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ success: true });
        }
      );
    }
  );
});

// delete doctor
app.delete("/api/doctors/:id", (req, res) => {
  const staffId = req.params.id;

  db.query("DELETE FROM Doctor WHERE staff_id = ?", [staffId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query("DELETE FROM Staff WHERE staff_id = ?", [staffId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true });
    });
  });
});

// ===================
// APPOINTMENT ROUTES
// ===================

// Get all appointments
app.get("/api/appointments", (req, res) => {
  db.query("SELECT * FROM Appointment", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all appointments for a specific doctor
app.get("/api/appointments/doctor/:id", (req, res) => {
  db.query(
    "SELECT * FROM Appointment WHERE doctor_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Validated appointment creation
app.post("/api/appointments", (req, res) => {
  const {
    patientId,
    doctorId,
    dateTime,
    length,
    status = "Scheduled",
  } = req.body;
  if (!patientId || !doctorId || !dateTime || !length)
    return res.status(400).json({ message: "Missing fields" });

  const date = new Date(dateTime);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const time = date.toTimeString().slice(0, 5);
  const [hour, minute] = time.split(":").map(Number);
  const requestStart = hour * 60 + minute;
  const requestEnd = requestStart + parseInt(length);

  db.query(
    "SELECT schedule FROM Doctor WHERE staff_id = ?",
    [doctorId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Doctor not found" });

      const schedule = JSON.parse(results[0].schedule);
      if (!schedule.days.includes(dayName)) {
        return res
          .status(400)
          .json({ message: "Doctor not available on this day." });
      }

      const [sh, sm] = schedule.startTime.split(":").map(Number);
      const [eh, em] = schedule.endTime.split(":").map(Number);
      const scheduleStart = sh * 60 + sm;
      const scheduleEnd = eh * 60 + em;

      if (requestStart < scheduleStart || requestEnd > scheduleEnd) {
        return res.status(400).json({ message: "Outside working hours." });
      }

      db.query(
        "SELECT * FROM Appointment WHERE doctor_id = ? AND DATE(date_time) = ? AND status != 'Cancelled'",
        [doctorId, date.toISOString().split("T")[0]],
        (err2, rows) => {
          if (err2) return res.status(500).json({ error: err2.message });

          const overlaps = rows.some((a) => {
            const aStart = new Date(a.date_time);
            const startMin = aStart.getHours() * 60 + aStart.getMinutes();
            const endMin = startMin + a.length;
            return !(requestEnd <= startMin || requestStart >= endMin);
          });

          if (overlaps) {
            return res
              .status(400)
              .json({ message: "Time slot is already booked." });
          }

          db.query(
            "INSERT INTO Appointment (patient_id, doctor_id, date_time, length, status) VALUES (?, ?, ?, ?, ?)",
            [patientId, doctorId, dateTime, length, status],
            (err3, result) => {
              if (err3) return res.status(500).json({ error: err3.message });
              res.json({ success: true, appointment_id: result.insertId });
            }
          );
        }
      );
    }
  );
});

// Reschedule/cancel
app.put("/api/appointments/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updates = {};

  if (req.body.status) updates.status = req.body.status;
  if (req.body.date_time) updates.date_time = req.body.date_time;
  if (req.body.length) updates.length = req.body.length;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid fields to update." });
  }

  db.query(
    "UPDATE Appointment SET ? WHERE appointment_id = ?",
    [updates, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ===================
// BILLING ROUTES
// ===================

// Get all bills
app.get("/api/bills", (req, res) => {
  db.query("SELECT * FROM Bill", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all bills for a patient
app.get("/api/bills/patient/:id", (req, res) => {
  db.query(
    "SELECT * FROM Bill WHERE patient_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Get single bill by ID
app.get("/api/bills/:id", (req, res) => {
  db.query(
    "SELECT * FROM Bill WHERE bill_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Bill not found" });
      res.json(results[0]);
    }
  );
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
  const issued_date = new Date().toISOString().slice(0, 19).replace("T", " ");
  db.query(
    "INSERT INTO Bill (patient_id, appointment_id, amount, description, status, issued_date) VALUES (?, ?, ?, ?, ?, ?)",
    [
      patient_id,
      appointment_id || null,
      amount,
      description,
      status,
      issued_date,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, bill_id: result.insertId });
    }
  );
});

// Update bill (e.g. mark as paid)
app.put("/api/bills/:id", (req, res) => {
  db.query(
    "UPDATE Bill SET ? WHERE bill_id = ?",
    [req.body, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Delete bill (optional)
app.delete("/api/bills/:id", (req, res) => {
  db.query("DELETE FROM Bill WHERE bill_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ===================
// RECORD ROUTES
// ===================

// Get all records
app.get("/api/records", (req, res) => {
  db.query("SELECT * FROM Record", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get records by patient ID
app.get("/api/records/patient/:id", (req, res) => {
  db.query(
    "SELECT * FROM Record WHERE patient_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Add a new record
app.post("/api/records", (req, res) => {
  const { patient_id, doctor_id, date, symptoms, diagnosis, notes } = req.body;
  if (!patient_id || !doctor_id || !date || !symptoms || !diagnosis) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.query(
    "INSERT INTO Record (patient_id, doctor_id, date, symptoms, diagnosis, notes) VALUES (?, ?, ?, ?, ?, ?)",
    [patient_id, doctor_id, date, symptoms, diagnosis, notes || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, record_id: result.insertId });
    }
  );
});

// ===================
// TEST ROUTES
// ===================

// Fetch completed tests
app.get("/api/tests/completed", (req, res) => {
  db.query(
    "SELECT * FROM Test WHERE result IS NOT NULL AND TRIM(result) != ''",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Get all tests
app.get("/api/tests", (req, res) => {
  db.query("SELECT * FROM Test", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get tests by patient ID
app.get("/api/tests/patient/:id", (req, res) => {
  db.query(
    "SELECT * FROM Test WHERE patient_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Get all tests with no result (pending)
app.get("/api/tests/pending", (req, res) => {
  db.query(
    "SELECT * FROM Test WHERE result IS NULL OR TRIM(result) = ''",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Add a test
app.post("/api/tests", (req, res) => {
  const { patient_id, doctor_id, date, test_name, result } = req.body;
  if (!patient_id || !doctor_id || !date || !test_name) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  db.query(
    "INSERT INTO Test (patient_id, doctor_id, date, test_name, result) VALUES (?, ?, ?, ?, ?)",
    [patient_id, doctor_id, date, test_name, result || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, test_id: result.insertId });
    }
  );
});

// Update a test result + assign labtech_id
app.put("/api/tests/:id", (req, res) => {
  const { result, labtech_id } = req.body;
  if (!result || !labtech_id) {
    return res.status(400).json({ message: "Missing result or labtech_id" });
  }

  db.query(
    "UPDATE Test SET result = ?, labtech_id = ? WHERE test_id = ?",
    [result, labtech_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// fetch completed tests
app.get("/api/tests/completed", (req, res) => {
  db.query(
    "SELECT * FROM Test WHERE result IS NOT NULL AND TRIM(result) != ''",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.get("/api/labtechs", (req, res) => {
  db.query(
    "SELECT * FROM Staff WHERE role = 'labtechnician'",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// ===================
// TRIAGE ROUTES
// ===================

// Get all triage entries
app.get("/api/triage", (req, res) => {
  db.query("SELECT * FROM Triage", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Record or update triage
app.post("/api/triage", (req, res) => {
  const { patient_id, bp, heart_rate, rating } = req.body;
  if (!patient_id || !bp || !heart_rate || !rating) {
    return res.status(400).json({ message: "Missing fields." });
  }

  db.query(
    "REPLACE INTO Triage (patient_id, bp, heart_rate, rating) VALUES (?, ?, ?, ?)",
    [patient_id, bp, heart_rate, rating],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ===================
// ROOM ROUTES
// ===================

// Get all rooms
app.get("/api/rooms", (req, res) => {
  db.query("SELECT * FROM Room", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new room
app.post("/api/rooms", (req, res) => {
  const { room_no, type, capacity } = req.body;
  if (!room_no || !type || !capacity) {
    return res.status(400).json({ message: "Missing fields" });
  }

  db.query(
    "INSERT INTO Room (room_no, type, capacity) VALUES (?, ?, ?)",
    [room_no, type, capacity],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Update room info
app.put("/api/rooms/:room_no", (req, res) => {
  db.query(
    "UPDATE Room SET ? WHERE room_no = ?",
    [req.body, req.params.room_no],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Delete room
app.delete("/api/rooms/:room_no", (req, res) => {
  db.query(
    "DELETE FROM Room WHERE room_no = ?",
    [req.params.room_no],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Get all patients assigned to a room
app.get("/api/rooms/:room_no/patients", (req, res) => {
  const query = `
    SELECT p.* FROM RoomAssignment ra
    JOIN Patient p ON ra.patient_id = p.patient_id
    WHERE ra.room_no = ?
  `;
  db.query(query, [req.params.room_no], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Assign patient to room
app.post("/api/rooms/:room_no/patients", (req, res) => {
  const { patient_id } = req.body;
  if (!patient_id)
    return res.status(400).json({ message: "Missing patient_id" });

  db.query(
    "INSERT INTO RoomAssignment (room_no, patient_id) VALUES (?, ?)",
    [req.params.room_no, patient_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Remove patient from room
app.delete("/api/rooms/:room_no/patients/:patient_id", (req, res) => {
  db.query(
    "DELETE FROM RoomAssignment WHERE room_no = ? AND patient_id = ?",
    [req.params.room_no, req.params.patient_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Room occupancy summary
app.get("/api/rooms/assignments", (req, res) => {
  const query = `
    SELECT r.room_no, COUNT(ra.patient_id) AS occupancy
    FROM Room r
    LEFT JOIN RoomAssignment ra ON r.room_no = ra.room_no
    GROUP BY r.room_no
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const summary = {};
    results.forEach((r) => (summary[r.room_no] = r.occupancy));
    res.json(summary);
  });
});

// Get a single room
app.get("/api/rooms/:room_no", (req, res) => {
  db.query(
    "SELECT * FROM Room WHERE room_no = ?",
    [req.params.room_no],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Room not found" });
      res.json(results[0]);
    }
  );
});

// ===================
// LOGIN ROUTE
// ===================
app.post("/api/login", (req, res) => {
  const { username, password, loginType } = req.body;

  if (loginType === "patient") {
    db.query(
      "SELECT * FROM Patient WHERE username = ? AND password = ?",
      [username, password],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0)
          return res.status(401).json({ message: "Invalid credentials" });

        const patient = results[0];
        res.json({
          success: true,
          userId: patient.patient_id,
          role: "patient",
          username: patient.username,
        });
      }
    );
  } else if (loginType === "staff") {
    const roles = ["doctor", "nurse", "receptionist", "labtechnician"];
    const tryRole = (i = 0) => {
      if (i >= roles.length)
        return res.status(401).json({ message: "Invalid credentials" });

      const role = roles[i];
      db.query(
        "SELECT * FROM Staff WHERE username = ? AND password = ? AND role = ?",
        [username, password, role],
        (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          if (results.length > 0) {
            const staff = results[0];
            res.json({
              success: true,
              userId: staff.staff_id,
              role,
              username: staff.username,
            });
          } else {
            tryRole(i + 1);
          }
        }
      );
    };
    tryRole();
  } else {
    res.status(400).json({ message: "Invalid login type" });
  }
});

app.get("/api/roomassignments", (req, res) => {
  db.query("SELECT * FROM RoomAssignment", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
