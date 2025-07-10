import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'User'
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      setError('All fields are required.');
      return;
    }

    try {
      await api.post('/api/Auth/register', formData);
      navigate('/login');
    } catch (err: unknown) {
      setError('Registration failed. Email might be in use.' + err);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '450px', margin: '4rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="fullName" onChange={handleChange} value={formData.fullName} required />

        <label>Email</label>
        <input type="email" name="email" onChange={handleChange} value={formData.email} required />

        <label>Password</label>
        <input type="password" name="password" onChange={handleChange} value={formData.password} required />

        <label>Role</label>
        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}

        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

const buttonStyle = {
  marginTop: '1rem',
  width: '100%',
  padding: '0.75rem',
  background: '#43a047',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer'
};

export default Register;
