// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/UserDashboard';
import FeedbackForm from './pages/user/FeedbackForm';
import FeedbackHistory from './pages/user/FeedbackHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllFeedbacks from './pages/admin/AllFeedbacks';
import Layout from './components/Layout';

function App() {
  const { token, role } = useAuthStore();

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={!token ? <Navigate to="/login" /> : <Navigate to={`/${role?.toLowerCase()}`} />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to={`/${role?.toLowerCase()}`} />} />
        <Route path="/register" element={<Register />} />

        {/* USER ROUTES */}
        <Route path="/user" element={token && role === 'User' ? <Layout><UserDashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/user/feedback" element={token && role === 'User' ? <Layout><FeedbackForm /></Layout> : <Navigate to="/login" />} />
        <Route path="/user/history" element={token && role === 'User' ? <Layout><FeedbackHistory /></Layout> : <Navigate to="/login" />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={token && role === 'Admin' ? <Layout><AdminDashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/admin/all-feedbacks" element={token && role === 'Admin' ? <Layout><AllFeedbacks /></Layout> : <Navigate to="/login" />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
