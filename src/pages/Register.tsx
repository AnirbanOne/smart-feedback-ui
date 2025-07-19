import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import "./Register.css";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  role?: string;
}

interface FormTouched {
  fullName: boolean;
  email: boolean;
  password: boolean;
  role: boolean;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'User'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({ 
    fullName: false, 
    email: false, 
    password: false, 
    role: false 
  });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

  // Validation patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z\s]{2,}$/;

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};

    if (touched.fullName) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (!nameRegex.test(formData.fullName.trim())) {
        newErrors.fullName = 'Please enter a valid full name (letters only, min 2 characters)';
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = 'Full name must be at least 2 characters';
      } else if (formData.fullName.trim().length > 50) {
        newErrors.fullName = 'Full name cannot exceed 50 characters';
      }
    }

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
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      }
    }

    if (touched.role) {
      if (!formData.role) {
        newErrors.role = 'Please select a role';
      }
    }

    setErrors(newErrors);
  }, [formData, touched]);

  // Password strength checker
  useEffect(() => {
    if (formData.password) {
      let score = 0;
      let message = '';

      if (formData.password.length >= 8) score++;
      if (/[a-z]/.test(formData.password)) score++;
      if (/[A-Z]/.test(formData.password)) score++;
      if (/\d/.test(formData.password)) score++;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) score++;

      switch (score) {
        case 0:
        case 1:
          message = 'Very Weak';
          break;
        case 2:
          message = 'Weak';
          break;
        case 3:
          message = 'Fair';
          break;
        case 4:
          message = 'Good';
          break;
        case 5:
          message = 'Strong';
          break;
        default:
          message = '';
      }

      setPasswordStrength({ score, message });
    } else {
      setPasswordStrength({ score: 0, message: '' });
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (error) setError("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (!nameRegex.test(formData.fullName.trim())) {
      newErrors.fullName = 'Please enter a valid full name';
      isValid = false;
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({ fullName: true, email: true, password: true, role: true });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/Auth/register', {
        ...formData,
        fullName: formData.fullName.trim()
      });
      
      // Show success message briefly before redirecting
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Email is already registered. Please use a different email.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && 
                     formData.fullName && 
                     formData.email && 
                     formData.password && 
                     formData.role;

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return '#ff6b6b';
      case 2:
        return '#ffa726';
      case 3:
        return '#ffca28';
      case 4:
        return '#66bb6a';
      case 5:
        return '#4caf50';
      default:
        return '#ddd';
    }
  };

  return (
    <div className="register-root">
      {/* Background with your existing styling */}
      <div className="register-bg">
        <div className="register-bg-stars" />
      </div>

      {/* Split Container */}
      <div className="register-container">
        {/* Left Side - Welcome */}
        <div className="welcome-side">
          <div className="welcome-content">
            <div className="brand-section">
              <div className="brand-icon">🎯</div>
              <h1 className="brand-title">Smart Feedback</h1>
              <p className="brand-subtitle">PORTAL</p>
            </div>
            
            <div className="welcome-message">
              <h2>Join Our Community!</h2>
              <p>Create your account to start sharing valuable feedback and making a positive impact on our platform.</p>
            </div>

            <div className="features">
              <div className="feature">
                <span className="feature-icon">🚀</span>
                <span>Quick Registration</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Secure & Private</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💬</span>
                <span>Share Your Voice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="register-side">
          <div className="register-header">
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtitle">Fill in your information to get started</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
            {/* Full Name Input */}
            <div className={`input-group ${errors.fullName ? 'error' : ''} ${formData.fullName ? 'filled' : ''}`}>
              <label>Full Name</label>
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
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={loading}
                />
              </div>
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>

            {/* Email Input */}
            <div className={`input-group ${errors.email ? 'error' : ''} ${formData.email ? 'filled' : ''}`}>
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="m3 4 7 5 7-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="email"
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
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <span 
                    className="strength-text"
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    {passwordStrength.message}
                  </span>
                </div>
              )}
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {/* Role Selection */}
            <div className={`input-group ${errors.role ? 'error' : ''} ${formData.role ? 'filled' : ''}`}>
              <label>Account Type</label>
              <div className="select-wrapper">
                {/* <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span> */}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={loading}
                >
                  <option value="">Select account type</option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="select-arrow">
                  <svg width="12" height="8" viewBox="0 0 12 8">
                    <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
              {errors.role && <span className="field-error">{errors.role}</span>}
            </div>

            {/* Error Message */}
            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`register-btn ${loading ? 'loading' : ''} ${isFormValid ? 'valid' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>CREATE ACCOUNT</span>
              )}
            </button>

            {/* Footer */}
            <div className="register-footer">
              Already have an account?
              <a href="/login">Sign In</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
