import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuthStore } from "../store/authStore";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  exp: number;
  iss: string;
  aud: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await api.post("/api/Auth/login", formData);
      const { token } = response.data;

      // 🔍 Decode the token
      const decoded: DecodedToken = jwtDecode(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const fullName =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ]; // using email as fullName for now

      setAuth(token, role as 'Admin' | 'User', fullName);
      navigate(`/${role.toLowerCase()}`);
    } catch (err: unknown) {
      setError("Invalid email or password." + err);
    }
  };

  return (
    <div
      className="glass-card"
      style={{ maxWidth: "400px", margin: "4rem auto" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          required
        />

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

const buttonStyle = {
  marginTop: "1rem",
  width: "100%",
  padding: "0.75rem",
  background: "#1e88e5",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer",
};

export default Login;
