import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM Triage", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post("/", (req, res) => {
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

export default router;
