import { useEffect, useState } from "react";
import axios from "axios";

const MyDoctor = ({ user }) => {
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    // Get patient info (including doctor_id)
    axios.get("http://localhost:6969/api/patients").then((res) => {
      const match = res.data.find((p) => p.username === user.username);
      if (match) {
        setPatient(match);

        // Now get doctor info
        axios.get("http://localhost:6969/api/doctors").then((res2) => {
          const doc = res2.data.find((d) => d.staff_id === match.doctor_id);
          setDoctor(doc);
        });
      }
    });
  }, [user.username]);

  if (!patient || !doctor) return <p>Loading doctor info...</p>;

  return (
    <div>
      <h2>My Doctor</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          maxWidth: "500px",
        }}
      >
        <p>
          <strong>Name:</strong> {doctor.first_name} {doctor.last_name}
        </p>
        <p>
          <strong>Specialty:</strong> {doctor.specialty}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
        <p>
          <strong>Staff ID:</strong> {doctor.staff_id}
        </p>
      </div>
    </div>
  );
};

export default MyDoctor;
