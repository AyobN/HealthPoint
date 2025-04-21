const PatientView = ({ user }) => {
  return (
    <div>
      <h2>Welcome, Patient #{user.userId}</h2>
      <p>This is your patient portal.</p>
      <ul>
        <li>View attending doctor and nurses</li>
        <li>Manage upcoming appointments</li>
        <li>View and pay your bills</li>
      </ul>
    </div>
  );
};

export default PatientView;
