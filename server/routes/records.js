import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM Record", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/patient/:id", (req, res) => {
  db.query("SELECT * FROM Record WHERE patient_id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { patient_id, doctor_id, date, symptoms, diagnosis, notes } = req.body;

  if (!patient_id || !doctor_id || !date || !symptoms || !diagnosis) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.query(
    "INSERT INTO Record (patient_id, doctor_id, date, symptoms, diagnosis, notes) VALUES (?, ?, ?, ?, ?, ?)",
    [patient_id, doctor_id, date, symptoms, diagnosis, notes],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, record_id: result.insertId });
    }
  );
});

export default router;
