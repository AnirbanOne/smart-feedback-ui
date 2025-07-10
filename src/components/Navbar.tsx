import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const { role, username, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', margin: '1rem' }}>
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
        🎯 Smart Feedback
      </Link>

      {role && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {role === 'User' && (
            <>
              <Link to="/user">Dashboard</Link>
              <Link to="/user/feedback">Submit</Link>
              <Link to="/user/history">My Feedback</Link>
            </>
          )}

          {role === 'Admin' && (
            <>
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/all-feedbacks">Feedbacks</Link>
            </>
          )}

          <span style={{ fontWeight: 600 }}>{username}</span>
          <button onClick={logout} style={{ background: 'tomato', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
