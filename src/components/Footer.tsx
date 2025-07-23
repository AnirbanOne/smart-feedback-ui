import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore"; // Adjust the import path based on your file structure
import "./Footer.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  const { token, role } = useAuthStore();

  // Function to render role-based navigation
  const renderNavigation = () => {
    if (!token) {
      // Show basic links for unauthenticated users
      return (
        <>
          <Link to="/login" className="footer-link">
            Login
          </Link>
          <Link to="/register" className="footer-link">
            Register
          </Link>
        </>
      );
    }

    if (role === 'User') {
      return (
        <>
          <Link to="/user" className="footer-link">
            Dashboard
          </Link>
          <Link to="/user/feedback" className="footer-link">
            Submit Feedback
          </Link>
          <Link to="/user/history" className="footer-link">
            My Feedbacks
          </Link>
        </>
      );
    }

    if (role === 'Admin') {
      return (
        <>
          <Link to="/admin" className="footer-link">
            Admin Dashboard
          </Link>
          <Link to="/admin/all-feedbacks" className="footer-link">
            All Feedbacks
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-col brand-col">
          <div className="footer-logo">🎯</div>
          <div className="footer-brand">
            <span className="footer-brand-title">Smart Feedback</span>
            <span className="footer-brand-desc">
              Empowering continuous improvement
            </span>
          </div>
          <a
            href="mailto:support@smartfeedback.com"
            className="footer-contact-btn"
          >
            Contact Us
          </a>
        </div>
        
        <div className="footer-col links-col">
          <nav>
            {renderNavigation()}
          </nav>
        </div>
        
        <div className="footer-col social-col">
          <a
            href="https://instagram.com"
            className="footer-social"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://twitter.com"
            className="footer-social"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://dribbble.com"
            className="footer-social"
            aria-label="Dribbble"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-dribbble"></i>
          </a>
        </div>
      </div>
      
      <div className="footer-meta">
        © 2025 Smart Feedback Portal | Built with{" "}
        <span role="img" aria-label="heart">
          ❤️
        </span>{" "}
        using React & .NET Core
      </div>
    </footer>
  );
};

export default Footer;
