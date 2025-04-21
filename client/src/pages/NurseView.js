const NurseView = ({ user }) => {
  return (
    <div>
      <h2>Welcome, Nurse #{user.userId}</h2>
      <p>This is your nurse portal.</p>
      <ul>
        <li>View assigned patients</li>
        <li>Access and update triage data</li>
      </ul>
    </div>
  );
};

export default NurseView;
