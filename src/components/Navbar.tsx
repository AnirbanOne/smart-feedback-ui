import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Navbar.css';

const Navbar = () => {
  const { role, username, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    clearAuth();
    navigate('/login');
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-background">
        {/* <div className="navbar-stars">
          {[...Array(15)].map((_, idx) => (
            <div
              key={idx}
              className="navbar-star"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div> */}
      </div>
      
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          <div className="logo-wrapper">
            <span role="img" aria-label="logo" className="navbar-logo-icon">🎯</span>
            <div className="logo-pulse"></div>
          </div>
          <div className="logo-text-wrapper">
            <span className="navbar-logo-text">Smart Feedback</span>
            <span className="navbar-logo-subtitle">Portal</span>
          </div>
        </Link>

        {role && (
          <div className="nav-menu">
            <div className="nav-links-wrapper">
              {role === 'User' && (
                <>
                  <Link 
                    to="/user" 
                    className={`nav-link ${isActivePage('/user') ? 'active' : ''}`}
                  >
                    <span className="nav-icon">📊</span>
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/user/feedback" 
                    className={`nav-link ${isActivePage('/user/feedback') ? 'active' : ''}`}
                  >
                    <span className="nav-icon">✍️</span>
                    <span>Submit</span>
                  </Link>
                  <Link 
                    to="/user/history" 
                    className={`nav-link ${isActivePage('/user/history') ? 'active' : ''}`}
                  >
                    <span className="nav-icon">📋</span>
                    <span>My Feedback</span>
                  </Link>
                </>
              )}

              {role === 'Admin' && (
                <>
                  <Link 
                    to="/admin" 
                    className={`nav-link ${isActivePage('/admin') ? 'active' : ''}`}
                  >
                    <span className="nav-icon">📊</span>
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/admin/all-feedbacks" 
                    className={`nav-link ${isActivePage('/admin/all-feedbacks') ? 'active' : ''}`}
                  >
                    <span className="nav-icon">📋</span>
                    <span>Feedbacks</span>
                  </Link>
                </>
              )}
            </div>

            <div className="nav-user-section">
              <div className="nav-user">
                <div className="user-avatar">
                  {username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                  <span className="user-name">{username}</span>
                  <span className="user-role">{role}</span>
                </div>
              </div>
              
              <button className="nav-btn nav-btn-logout" onClick={logout}>
                <span className="logout-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
