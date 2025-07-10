import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

interface Feedback {
  category: string;
  content: string;
  sentiment: string;
  submittedAt: string;
  user: {
    fullName: string;
  };
}

const AllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    api.get('/api/Feedback/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setFeedbacks(res.data))
    .catch(() => {});
  }, [token]);

  // Group feedbacks by user fullName
  const groupedFeedbacks = feedbacks.reduce((acc, feedback) => {
    const name = feedback.user?.fullName || 'Unknown User';
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(feedback);
    return acc;
  }, {} as Record<string, Feedback[]>);

  return (
    <div className="glass-card">
      <h2>All Feedbacks by Users</h2>

      {Object.entries(groupedFeedbacks).map(([userName, userFeedbacks]) => (
        <div key={userName} style={userBlockStyle}>
          <h3 style={userNameStyle}>👤 {userName}</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {userFeedbacks.map((fb, idx) => (
              <li key={idx} style={feedbackCardStyle}>
                <p><strong>📁 Category:</strong> {fb.category}</p>
                <p><strong>💬 Content:</strong> {fb.content}</p>
                <p><strong>🧠 Sentiment:</strong> {fb.sentiment}</p>
                <p><strong>🕒 Submitted At:</strong> {new Date(fb.submittedAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const userBlockStyle: React.CSSProperties = {
  marginBottom: '2rem',
  padding: '1rem',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.06)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)'
};

const userNameStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  marginBottom: '1rem',
  color: '#00e5ff'
};

const feedbackCardStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.08)',
  marginBottom: '1rem',
  borderLeft: '4px solid #64b5f6'
};

export default AllFeedbacks;
