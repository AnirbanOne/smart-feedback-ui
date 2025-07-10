import { useEffect, useState } from 'react';
import api from '../../utils/api';

interface Feedback {
  category: string;
  content: string;
  sentiment: string;
  submittedAt: string;
  user: { fullName: string; email: string };
}

const FeedbackHistory = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    api.get('/api/Feedback/my')
      .then(res => setFeedbacks(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="glass-card">
      <h2>My Feedback History</h2>
      {feedbacks.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <ul>
          {feedbacks.map((fb, idx) => (
            <li key={idx} style={{ marginBottom: '1rem' }}>
              <strong>{fb.category}</strong> - <em>{fb.sentiment}</em> <br />
              {fb.content} <br />
              <small>{new Date(fb.submittedAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackHistory;
