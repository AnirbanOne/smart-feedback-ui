import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuthStore } from "../store/authStore";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  exp: number;
  iss: string;
  aud: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface FormTouched {
  email: boolean;
  password: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({ email: false, password: false });

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};

    if (touched.email) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (touched.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (error) setError("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleRemember = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemember(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      setError("Please fix the errors above");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/Auth/login", formData);
      const { token } = response.data;
      const decoded: DecodedToken = jwtDecode(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const fullName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
      
      setAuth(token, role as "Admin" | "User", fullName);
      
      setTimeout(() => {
        navigate(`/${role.toLowerCase()}`);
      }, 500);
      
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && formData.email && formData.password;

  return (
    <div className="login-root">
      {/* Background with your existing styling */}
      <div className="login-bg">
        <div className="login-bg-stars" />
      </div>

      {/* Split Container */}
      <div className="login-container">
        {/* Left Side - Welcome */}
        <div className="welcome-side-login">
          <div className="welcome-content">
            <div className="brand-section">
              <div className="brand-icon">🎯</div>
              <h1 className="brand-title">Smart Feedback</h1>
              <p className="brand-subtitle">PORTAL</p>
            </div>
            
            <div className="welcome-message">
              <h2>Welcome Back!</h2>
              <p>Sign in to access your personalized dashboard and continue making a difference with your valuable insights.</p>
            </div>

            <div className="features">
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Advanced Analytics</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🚀</span>
                <span>Quick Submissions</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💡</span>
                <span>Smart Insights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form (No glass card wrapper) */}
        <div className="login-side">
          <div className="login-header">
            <h2 className="login-title">Login</h2>
            <p className="login-subtitle">Enter your credentials to continue</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            {/* Username Input */}
            <div className={`input-group ${errors.email ? 'error' : ''} ${formData.email ? 'filled' : ''}`}>
              <label>Username</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 6v-1a7 7 0 0 1 14 0v1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="username"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Password Input */}
            <div className={`input-group ${errors.password ? 'error' : ''} ${formData.password ? 'filled' : ''}`}>
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 8V6a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {/* Remember & Forgot */}
            <div className="login-options">
              <label className="remember-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={handleRemember}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="/forgot-password" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`login-btn ${loading ? 'loading' : ''} ${isFormValid ? 'valid' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>LOGIN</span>
              )}
            </button>

            {/* Footer */}
            <div className="login-footer">
              Don't have account yet?
              <Link to="/register">New Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
