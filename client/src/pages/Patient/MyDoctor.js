import { useEffect, useState } from "react";
import API from "../../api";

const MyDoctor = ({ user }) => {
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const patientRes = await API.get("/patients");
      const match = patientRes.data.find((p) => p.username === user.username);
      if (!match) return;

      setPatient(match);

      const doctorRes = await API.get(`/doctors/${match.doctor_id}`);
      setDoctor(doctorRes.data);
    };

    if (user?.username) fetchData();
  }, [user?.username]);

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
      </div>
    </div>
  );
};

export default MyDoctor;
