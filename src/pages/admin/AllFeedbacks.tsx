import { useEffect, useState } from 'react';
import api from '../../utils/api';
import ExportButton from '../../components/ExportButton';
import { useAuthStore } from '../../store/authStore';
import './AllFeedbacks.css';

interface Feedback {
  category: string;
  content: string;
  sentiment: string;
  submittedAt: string;
  user: {
    fullName: string;
  };
}

// Enhanced mappings for category and sentiment visuals
const categoryIcons: Record<string, string> = {
  Product: "💡",
  Support: "🛠",
  General: "📝",
  Education: "🎓",
  Sales: "💼",
  Sports: "⚽",
  Academics: "📚",
  Events: "🎉"
};

const categoryColors: Record<string, string> = {
  Product: "#8937ff",
  Support: "#b580fc",
  General: "#6d29e7",
  Education: "#9f5bff",
  Sales: "#7c40fa",
  Sports: "#8937ff",
  Academics: "#b580fc",
  Events: "#6d29e7"
};

const categoryAvatarBG: Record<string, string> = {
  Product: "rgba(137, 55, 255, 0.2)",
  Support: "rgba(181, 128, 252, 0.2)",
  General: "rgba(109, 41, 231, 0.2)",
  Education: "rgba(159, 91, 255, 0.2)",
  Sales: "rgba(124, 64, 250, 0.2)",
  Sports: "rgba(137, 55, 255, 0.2)",
  Academics: "rgba(181, 128, 252, 0.2)",
  Events: "rgba(109, 41, 231, 0.2)"
};

const sentimentEmoji: Record<string, string> = {
  Positive: "😊",
  Neutral: "😐",
  Negative: "😞"
};

const sentimentBG: Record<string, string> = {
  Positive: "#ffc94d",
  Neutral: "#ffe89e",
  Negative: "#ffb366"
};

const AllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    api.get('/api/Feedback/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setFeedbacks(res.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
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

  if (loading) {
    return (
      <div className="all-feedbacks-page">
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
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <h2 className="loading-text">Loading Feedbacks...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="all-feedbacks-page">
      {/* Animated Background - Same as Admin Dashboard */}
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
      <div className="page-header">
        <h2 className="page-title">
          <span className="title-icon">📋</span>
          All User Feedbacks
        </h2>
        <p className="page-subtitle">Comprehensive overview of all user feedback submissions</p>
        <ExportButton />
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-item">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-number">{feedbacks.length}</div>
            <div className="stat-label">Total Feedbacks</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{Object.keys(groupedFeedbacks).length}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <div className="stat-number">{new Set(feedbacks.map(f => f.category)).size}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="users-grid">
        {Object.entries(groupedFeedbacks).map(([userName, userFeedbacks], userIndex) => (
          <div 
            className="user-feedback-block" 
            key={userName}
            style={{ animationDelay: `${userIndex * 0.1}s` }}
          >
            <div className="user-header">
              <h3 className="user-name">
                <span className="user-avatar">{userName.charAt(0).toUpperCase()}</span>
                {userName}
              </h3>
              <div className="user-stats">
                <span className="feedback-count">{userFeedbacks.length} feedback{userFeedbacks.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="feedback-cards-grid">
              {userFeedbacks.map((fb, idx) => {
                const icon = categoryIcons[fb.category] || "📝";
                const catColor = categoryColors[fb.category] || "#8937ff";
                const avatarBG = categoryAvatarBG[fb.category] || "rgba(181, 128, 252, 0.2)";
                const sEmoji = sentimentEmoji[fb.sentiment] || "😐";
                const sBG = sentimentBG[fb.sentiment] || "#ffd166";
                
                return (
                  <div 
                    className="enhanced-flip-card" 
                    key={idx}
                    style={{ animationDelay: `${(userIndex * 0.1) + (idx * 0.05)}s` }}
                  >
                    <div className="flip-card-inner">
                      {/* Enhanced Card Front */}
                      <div className="flip-card-front">
                        <div className="card-glow" style={{ background: `linear-gradient(135deg, ${catColor}33, ${catColor}11)` }}></div>
                        <div className="card-header">
                          <div className="category-section">
                            <div className="category-avatar" style={{ background: avatarBG, color: catColor }}>
                              {icon}
                            </div>
                            <div className="category-info">
                              <span className="category-name" style={{ color: catColor }}>
                                {fb.category}
                              </span>
                              <span className="category-label">Category</span>
                            </div>
                          </div>
                          <div className="sentiment-indicator" style={{ background: sBG }}>
                            {sEmoji}
                          </div>
                        </div>
                        
                        <div className="card-body">
                          <div className="feedback-preview">
                            "{fb.content.substring(0, 80)}..."
                          </div>
                        </div>
                        
                        <div className="card-footer">
                          <div className="date-info">
                            <span className="date-icon">📅</span>
                            <span className="date-text">
                              {new Date(fb.submittedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flip-hint">
                            <span>👆 Hover to read full feedback</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Card Back */}
                      <div className="flip-card-back">
                        <div className="back-header">
                          <h4>💬 Complete Feedback</h4>
                          <div className="sentiment-badge" style={{ background: sBG }}>
                            {sEmoji} {fb.sentiment}
                          </div>
                        </div>
                        <div className="feedback-content">
                          <p>{fb.content}</p>
                        </div>
                        <div className="back-footer">
                          <div className="submission-info">
                            <span>Submitted on {new Date(fb.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllFeedbacks;
