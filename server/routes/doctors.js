import express from "express";
import db from "../db.js";
const router = express.Router();

// GET /api/doctors/:id/schedule
router.get("/:id/schedule", (req, res) => {
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

// GET /api/doctors
router.get("/", (req, res) => {
  db.query("SELECT * FROM Staff WHERE role = 'doctor'", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /api/doctors/:id
router.get("/:id", (req, res) => {
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

// GET /api/doctors/:id/availability
router.get("/:id/availability", (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { date, length } = req.query;

  if (!date || !length) {
    return res.status(400).json({ message: "Missing date or length." });
  }

  // 1. Get doctor schedule
  const scheduleQuery = "SELECT schedule FROM Doctor WHERE staff_id = ?";
  db.query(scheduleQuery, [doctorId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Doctor not found" });

    const schedule = JSON.parse(results[0].schedule);
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!schedule.days.includes(dayName)) {
      return res.json([]); // Not available that day
    }

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

    // 2. Get existing appointments for that doctor on that date
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

export default router;
