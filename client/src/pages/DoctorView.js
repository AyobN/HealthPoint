const DoctorView = ({ user }) => {
  return (
    <div>
      <h2>Welcome, Doctor #{user.userId}</h2>
      <p>This is your doctor portal.</p>
      <ul>
        <li>View your appointments</li>
        <li>Access patient records</li>
        <li>Review and order tests</li>
      </ul>
    </div>
  );
};

export default DoctorView;
