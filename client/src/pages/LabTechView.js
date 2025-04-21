const LabTechnicianView = ({ user }) => {
  return (
    <div>
      <h2>Welcome, Lab Technician #{user.userId}</h2>
      <p>Here you will view and manage test results.</p>
    </div>
  );
};

export default LabTechnicianView;
