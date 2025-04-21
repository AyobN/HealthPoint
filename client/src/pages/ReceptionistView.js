const ReceptionistView = ({ user }) => {
  return (
    <div>
      <h2>Welcome, Receptionist #{user.userId}</h2>
      <p>This is your receptionist portal.</p>
      <ul>
        <li>Book, reschedule, or cancel appointments</li>
        <li>View doctors and their schedules</li>
      </ul>
    </div>
  );
};

export default ReceptionistView;
