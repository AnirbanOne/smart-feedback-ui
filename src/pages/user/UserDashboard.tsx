import { useAuthStore } from '../../store/authStore';

const UserDashboard = () => {
  const { username } = useAuthStore();

  return (
    <div className="glass-card">
      <h2>Welcome, {username}!</h2>
      <p style={{ marginTop: '1rem' }}>
        Submit your feedback using the form, and view your past feedback in the history section.
      </p>
    </div>
  );
};

export default UserDashboard;
