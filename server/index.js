import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./routes/patients.js";
import loginRoutes from "./routes/login.js";
import billingRoutes from "./routes/billing.js";
import appointmentRoutes from "./routes/appointments.js";
import recordRoutes from "./routes/records.js";
import roomRoutes from "./routes/rooms.js";
import testRoutes from "./routes/tests.js";
import triageRoutes from "./routes/triage.js";
import doctorRoutes from "./routes/doctors.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6969;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/bills", billingRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/triage", triageRoutes);

app.get("/", (req, res) => {
  res.send("HealthPoint backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
