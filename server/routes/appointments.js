import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM Appointment", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Validated appt creation
router.post("/", async (req, res) => {
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

  const date = new Date(dateTime);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const time = date.toTimeString().slice(0, 5); // "HH:MM"
  const [hour, minute] = time.split(":").map(Number);
  const requestStart = hour * 60 + minute;
  const requestEnd = requestStart + parseInt(length);

  // 1. Fetch doctor's schedule
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

      // 2. Check for overlap with existing appointments
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

          // 3. Insert appointment
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

// GET /api/doctors/:id/appointments
router.get("/doctor/:id", (req, res) => {
  const doctorId = parseInt(req.params.id);
  db.query(
    "SELECT * FROM Appointment WHERE doctor_id = ?",
    [doctorId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { dateTime, length, status } = req.body;

  // 1. Get existing appointment (so we know doctor_id)
  db.query(
    "SELECT * FROM Appointment WHERE appointment_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Appointment not found" });

      const appointment = results[0];
      const doctorId = appointment.doctor_id;
      const date = new Date(dateTime);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const time = date.toTimeString().slice(0, 5);
      const [h, m] = time.split(":").map(Number);
      const startMin = h * 60 + m;
      const endMin = startMin + parseInt(length);

      // 2. Fetch doctor schedule
      db.query(
        "SELECT schedule FROM Doctor WHERE staff_id = ?",
        [doctorId],
        (err2, result2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          if (result2.length === 0)
            return res.status(404).json({ message: "Doctor not found" });

          const schedule = JSON.parse(result2[0].schedule);
          if (!schedule.days.includes(dayName)) {
            return res
              .status(400)
              .json({ message: "Doctor not available on this day." });
          }

          const [sh, sm] = schedule.startTime.split(":").map(Number);
          const [eh, em] = schedule.endTime.split(":").map(Number);
          const scheduleStart = sh * 60 + sm;
          const scheduleEnd = eh * 60 + em;

          if (startMin < scheduleStart || endMin > scheduleEnd) {
            return res.status(400).json({ message: "Outside working hours." });
          }

          // 3. Check overlap with other appointments
          db.query(
            "SELECT * FROM Appointment WHERE doctor_id = ? AND DATE(date_time) = ? AND appointment_id != ? AND status != 'Cancelled'",
            [doctorId, date.toISOString().split("T")[0], id],
            (err3, others) => {
              if (err3) return res.status(500).json({ error: err3.message });

              const conflict = others.some((a) => {
                const aStart = new Date(a.date_time);
                const sMin = aStart.getHours() * 60 + aStart.getMinutes();
                const eMin = sMin + a.length;
                return !(endMin <= sMin || startMin >= eMin);
              });

              if (conflict) {
                return res
                  .status(400)
                  .json({ message: "Time slot is already booked." });
              }

              // 4. Update appointment
              const update = {
                date_time: dateTime,
                length,
                ...(status ? { status } : {}),
              };

              db.query(
                "UPDATE Appointment SET ? WHERE appointment_id = ?",
                [update, id],
                (err4) => {
                  if (err4)
                    return res.status(500).json({ error: err4.message });
                  res.json({ success: true });
                }
              );
            }
          );
        }
      );
    }
  );
});

export default router;
