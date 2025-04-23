import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM Patient", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
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

router.post("/", (req, res) => {
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
      status,
      doctor_id || null,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, patient_id: result.insertId });
    }
  );
});

router.put("/:id", (req, res) => {
  db.query(
    "UPDATE Patient SET ? WHERE patient_id = ?",
    [req.body, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM Patient WHERE patient_id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// POST /api/patients/:id/discharge
router.post("/:id/discharge", (req, res) => {
  const id = parseInt(req.params.id);

  // 1. Confirm patient exists
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

      // 2. Remove from room and update status
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

// POST /api/patients/:id/admit
router.post("/:id/admit", async (req, res) => {
  const id = parseInt(req.params.id);

  // 1. Check patient exists
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

      // 2. Find available room (prefer Waiting Room)
      db.query(
        `SELECT r.room_no
       FROM Room r
       LEFT JOIN RoomAssignment ra ON r.room_no = ra.room_no
       GROUP BY r.room_no
       HAVING COUNT(ra.patient_id) < r.capacity`,
        [],
        (err2, rooms) => {
          if (err2) return res.status(500).json({ error: err2.message });
          if (rooms.length === 0)
            return res.status(400).json({ message: "No rooms available." });

          const preferredRoom =
            rooms.find((r) => r.type === "Waiting Room") || rooms[0];

          // 3. Assign to room
          db.query(
            "INSERT INTO RoomAssignment (room_no, patient_id) VALUES (?, ?)",
            [preferredRoom.room_no, id],
            (err3) => {
              if (err3) return res.status(500).json({ error: err3.message });

              // 4. Update patient status
              db.query(
                "UPDATE Patient SET status = 'inpatient' WHERE patient_id = ?",
                [id],
                (err4) => {
                  if (err4)
                    return res.status(500).json({ error: err4.message });

                  res.json({ success: true, room_no: preferredRoom.room_no });
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
