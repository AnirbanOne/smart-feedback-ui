import { useAuthStore } from "../../store/authStore";
import { useEffect, useState } from "react";
import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";

const shootingStarsCount = 2;

interface DashboardStats {
  totalFeedbacks: number;
  pendingFeedbacks: number;
  categories: string[];
  recentFeedback: {
    category: string;
    content: string;
    date: string;
    sentiment: string;
  } | null;
}

const UserDashboard = () => {
  const { username } = useAuthStore();
  const navigate = useNavigate();
  const [dateString, setDateString] = useState<string>(() =>
    new Date().toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const [stats, setStats] = useState<DashboardStats>({
    totalFeedbacks: 0,
    pendingFeedbacks: 0,
    categories: [],
    recentFeedback: null,
  });

  const handleGetStarted = () => {
    navigate("/user/feedback");
  };

  const handleViewHistory = () => {
    navigate("/user/history");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDateString(
        new Date().toLocaleString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      setTimeout(() => {
        setStats({
          totalFeedbacks: 12,
          pendingFeedbacks: 2,
          categories: ["Sports", "Academics", "Events"],
          recentFeedback: {
            category: "Sports",
            content: "Great facilities and equipment!",
            date: "2 days ago",
            sentiment: "Positive",
          },
        });
      }, 1000);
    };
    loadStats();
  }, []);

  const quickActions = [
    {
      icon: "✍️",
      title: "Submit Feedback",
      description: "Share your thoughts and experiences",
      action: handleGetStarted,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: "📊",
      title: "View History",
      description: "See your previous feedback",
      action: handleViewHistory,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: "🎯",
      title: "Quick Survey",
      description: "Take a 2-minute survey",
      action: () => navigate("/user/survey"),
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  return (
    <div className="user-dashboard-hero">
      {/* Original Hero Banner (WITHOUT mountain waves) */}
      <div className="hero-banner">
        <div className="sky-bg">
          {[...Array(shootingStarsCount)].map((_, idx) => (
            <div
              className={`shooting-star shooting-star-${idx}`}
              key={idx}
            ></div>
          ))}
          <div className="starfield">
            {[...Array(30)].map((_, idx) => (
              <span
                key={idx}
                className="star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></span>
            ))}
          </div>
          {/* Mountain waves removed from here */}
        </div>
        <div className="welcome-content">
          <h1 className="welcome-title">
            WELCOME, {username?.split(" ")[0]?.toUpperCase() || "USER"}!
          </h1>
          <h2 className="welcome-subtitle">We are here for you</h2>
          <p className="welcome-desc">
            We're delighted to see you! Submit your feedback to help us improve,
            and browse your feedback history anytime.
            <br />
            <span className="welcome-date">{dateString}</span>
          </p>
          <button className="hero-cta-btn" onClick={handleGetStarted}>
            <span>Get Started</span>
          </button>
        </div>
      </div>

      {/* New Dashboard Features */}
      <div className="dashboard-features">
        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card" style={{ animationDelay: "0.1s" }}>
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalFeedbacks}</div>
                <div className="stat-label">Total Feedback</div>
              </div>
            </div>
            <div className="stat-card" style={{ animationDelay: "0.2s" }}>
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-number">{stats.pendingFeedbacks}</div>
                <div className="stat-label">Pending Review</div>
              </div>
            </div>
            <div className="stat-card" style={{ animationDelay: "0.3s" }}>
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-number">{stats.categories.length}</div>
                <div className="stat-label">Categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="action-card"
                style={{ background: action.gradient }}
                onClick={action.action}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {stats.recentFeedback && (
          <div className="recent-activity-section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="recent-feedback-card">
              <div className="feedback-header">
                <div className="feedback-category">
                  <span className="category-icon">📁</span>
                  <span>{stats.recentFeedback.category}</span>
                </div>
                <div className="feedback-date">{stats.recentFeedback.date}</div>
              </div>
              <div className="feedback-content">
                <p>"{stats.recentFeedback.content}"</p>
              </div>
              <div className="feedback-sentiment">
                <span className="sentiment-badge positive">
                  😊 {stats.recentFeedback.sentiment}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Wave design moved to the END of dashboard features */}
        <div className="section-bottom-wave">
          <svg
            className="bottom-wave-svg"
            viewBox="0 0 1440 210"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ width: "100vw", minWidth: "100vw" }}
          >
            <path
              d="M0 110 Q360 90 720 200 T1440 110 V210H0V110Z"
              fill="#210094"
            />
            <path
              d="M0 172 Q500 220 900 90 T1440 190 V210H0V172Z"
              fill="#322cb6"
            />
            <path
              d="M0 90 Q500 80 1000 170 T1440 70 V210H0V90Z"
              fill="#6f46c9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
