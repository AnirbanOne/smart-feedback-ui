import { Link } from "react-router-dom";
import "./Footer.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => (
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
          <Link to="/" className="footer-link">
            Home
          </Link>
          <Link to="/user" className="footer-link">
            User Dashboard
          </Link>
          <Link to="/admin" className="footer-link">
            Admin Dashboard
          </Link>
          <Link to="/about" className="footer-link">
            About
          </Link>
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

export default Footer;
