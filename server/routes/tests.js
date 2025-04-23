import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM Test", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/patient/:id", (req, res) => {
  db.query("SELECT * FROM Test WHERE patient_id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/pending", (req, res) => {
  db.query("SELECT * FROM Test WHERE result IS NULL OR TRIM(result) = ''", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/completed", (req, res) => {
  db.query("SELECT * FROM Test WHERE result IS NOT NULL AND TRIM(result) != ''", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
  const { result, labtech_id } = req.body;
  if (!result || !labtech_id) return res.status(400).json({ message: "Missing fields." });

  db.query(
    "UPDATE Test SET result = ?, labtech_id = ? WHERE test_id = ?",
    [result, labtech_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

export default router;
