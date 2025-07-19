import { useEffect, useState } from 'react';
import api from '../../utils/api';
import './FeedbackHistory.css';

interface Feedback {
  category: string;
  content: string;
  sentiment: string;
  submittedAt: string;
  user: { fullName: string; email: string };
}

// Enhanced visual mappings
const categoryConfig = {
  Sports: { icon: '⚽', color: '#8937ff', bgGradient: 'linear-gradient(135deg, #8937ff, #b580fc)' },
  Academics: { icon: '📚', color: '#b580fc', bgGradient: 'linear-gradient(135deg, #b580fc, #6d29e7)' },
  Events: { icon: '🎉', color: '#6d29e7', bgGradient: 'linear-gradient(135deg, #6d29e7, #9f5bff)' },
  General: { icon: '💬', color: '#9f5bff', bgGradient: 'linear-gradient(135deg, #9f5bff, #7c40fa)' },
  Product: { icon: '💡', color: '#7c40fa', bgGradient: 'linear-gradient(135deg, #7c40fa, #8937ff)' },
  Support: { icon: '🛠', color: '#8937ff', bgGradient: 'linear-gradient(135deg, #8937ff, #b580fc)' },
  Education: { icon: '🎓', color: '#b580fc', bgGradient: 'linear-gradient(135deg, #b580fc, #6d29e7)' },
  Sales: { icon: '💼', color: '#6d29e7', bgGradient: 'linear-gradient(135deg, #6d29e7, #9f5bff)' }
};

const sentimentConfig = {
  Positive: { emoji: '😊', color: '#ffc94d', bgColor: 'rgba(255, 201, 77, 0.2)' },
  Neutral: { emoji: '😐', color: '#ffe89e', bgColor: 'rgba(255, 232, 158, 0.2)' },
  Negative: { emoji: '😞', color: '#ffb366', bgColor: 'rgba(255, 179, 102, 0.2)' }
};

const FeedbackHistory = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);

  useEffect(() => {
    api.get('/api/Feedback/my')
      .then(res => {
        setFeedbacks(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCardClick = (index: number) => {
    setSelectedFeedback(selectedFeedback === index ? null : index);
  };

  if (loading) {
    return (
      <div className="feedback-history-container">
        {/* Animated Background */}
        <div className="dashboard-background">
          <div className="stars-container">
            {[...Array(50)].map((_, idx) => (
              <div
                key={idx}
                className="star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
          <div className="floating-orbs">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="floating-orb"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${8 + Math.random() * 6}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Loading your feedback journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-history-container">
      {/* Animated Background - Same as Dashboard */}
      <div className="dashboard-background">
        <div className="stars-container">
          {[...Array(50)].map((_, idx) => (
            <div
              key={idx}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        <div className="floating-orbs">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="floating-orb"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 6}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header Section */}
      <div className="history-header">
        <h2 className="history-title">✨ My Feedback Journey</h2>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{feedbacks.length}</span>
            <span className="stat-label">Total Feedback</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{new Set(feedbacks.map(f => f.category)).size}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{feedbacks.filter(f => f.sentiment === 'Positive').length}</span>
            <span className="stat-label">Positive</span>
          </div>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌟</div>
          <h3>Your feedback journey starts here!</h3>
          <p>Share your thoughts and experiences with us.</p>
          <button className="cta-button" onClick={() => window.location.href = '/user/feedback'}>
            Submit Your First Feedback
          </button>
        </div>
      ) : (
        <div className="timeline-container">
          {feedbacks.map((feedback, index) => {
            const categoryData = categoryConfig[feedback.category as keyof typeof categoryConfig] || categoryConfig.General;
            const sentimentData = sentimentConfig[feedback.sentiment as keyof typeof sentimentConfig];
            const isExpanded = selectedFeedback === index;

            return (
              <div
                key={index}
                className={`timeline-item ${isExpanded ? 'expanded' : ''}`}
                onClick={() => handleCardClick(index)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="timeline-marker" style={{ background: categoryData.bgGradient }}>
                  <span className="timeline-icon">{categoryData.icon}</span>
                </div>
                
                <div className="timeline-content">
                  <div className="feedback-card">
                    <div className="card-header">
                      <div className="category-badge" style={{ background: categoryData.bgGradient }}>
                        {categoryData.icon} {feedback.category}
                      </div>
                      <div className="sentiment-badge" style={{ background: sentimentData.bgColor, color: sentimentData.color }}>
                        {sentimentData.emoji} {feedback.sentiment}
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <p className="feedback-preview">
                        {isExpanded ? feedback.content : `${feedback.content.substring(0, 100)}...`}
                      </p>
                      {isExpanded && (
                        <div className="expanded-content">
                          <div className="feedback-meta">
                            <div className="meta-item">
                              <span className="meta-icon">📅</span>
                              <span>{new Date(feedback.submittedAt).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-icon">⏰</span>
                              <span>{new Date(feedback.submittedAt).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="card-footer">
                      <span className="expand-hint">
                        {isExpanded ? '👆 Click to collapse' : '👆 Click to expand'}
                      </span>
                      <span className="date-short">
                        {new Date(feedback.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FeedbackHistory;
