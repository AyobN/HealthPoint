import express from "express";
import db from "../db.js";
const router = express.Router();

router.post("/", (req, res) => {
  const { username, password, loginType } = req.body;

  if (loginType === "patient") {
    db.query("SELECT * FROM Patient WHERE username = ? AND password = ?", [username, password], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

      const patient = results[0];
      res.json({
        success: true,
        userId: patient.patient_id,
        role: "patient",
        username: patient.username
      });
    });
  } else if (loginType === "staff") {
    const roles = ["doctor", "nurse", "receptionist", "labtechnician"];
    const checkRole = (i = 0) => {
      if (i >= roles.length) return res.status(401).json({ message: "Invalid credentials" });

      const role = roles[i];
      db.query("SELECT * FROM Staff WHERE username = ? AND password = ? AND role = ?", [username, password, role], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
          const staff = results[0];
          res.json({
            success: true,
            userId: staff.staff_id,
            role: role,
            username: staff.username
          });
        } else {
          checkRole(i + 1);
        }
      });
    };

    checkRole();
  } else {
    res.status(400).json({ message: "Invalid login type" });
  }
});

export default router;
