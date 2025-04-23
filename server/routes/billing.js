import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM Bill", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/patient/:id", (req, res) => {
  db.query("SELECT * FROM Bill WHERE patient_id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  db.query("SELECT * FROM Bill WHERE bill_id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Bill not found" });
    res.json(results[0]);
  });
});

router.post("/", (req, res) => {
  const { patient_id, amount, description, status = "Unpaid" } = req.body;
  db.query(
    "INSERT INTO Bill (patient_id, amount, description, status) VALUES (?, ?, ?, ?)",
    [patient_id, amount, description, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, bill_id: result.insertId });
    }
  );
});

router.put("/:id", (req, res) => {
  db.query("UPDATE Bill SET ? WHERE bill_id = ?", [req.body, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM Bill WHERE bill_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

export default router;
