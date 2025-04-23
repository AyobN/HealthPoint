import express from "express";
import db from "../db.js";
const router = express.Router();

// Get all rooms
router.get("/", (req, res) => {
  db.query("SELECT * FROM Room", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a single room
router.get("/:room_no", (req, res) => {
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

// Create new room
router.post("/", (req, res) => {
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
router.put("/:room_no", (req, res) => {
  db.query(
    "UPDATE Room SET ? WHERE room_no = ?",
    [req.body, req.params.room_no],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Delete a room
router.delete("/:room_no", (req, res) => {
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
router.get("/:room_no/patients", (req, res) => {
  const query = `
    SELECT p.*
    FROM RoomAssignment ra
    JOIN Patient p ON ra.patient_id = p.patient_id
    WHERE ra.room_no = ?
  `;
  db.query(query, [req.params.room_no], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Assign patient to a room
router.post("/:room_no/patients", (req, res) => {
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

// Remove patient from a room
router.delete("/:room_no/patients/:patient_id", (req, res) => {
  db.query(
    "DELETE FROM RoomAssignment WHERE room_no = ? AND patient_id = ?",
    [req.params.room_no, req.params.patient_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// GET /api/rooms/assignments → return room_no -> # of assigned patients
router.get("/assignments", (req, res) => {
  const query = `
    SELECT r.room_no, COUNT(ra.patient_id) AS occupancy
    FROM Room r
    LEFT JOIN RoomAssignment ra ON r.room_no = ra.room_no
    GROUP BY r.room_no
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Convert to room_no: count format for frontend compatibility
    const response = {};
    results.forEach((r) => {
      response[r.room_no] = r.occupancy;
    });

    res.json(response);
  });
});

export default router;
