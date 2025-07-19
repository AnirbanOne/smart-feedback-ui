import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import './AdminDashboard.css';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface SummaryData {
  category: Record<string, number>;
  sentiment: Record<string, number>;
  date: Record<string, number>;
}

const AdminDashboard = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/api/Dashboard/summary')
      .then(res => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-root">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <h2 className="loading-text">Loading Analytics...</h2>
          <p className="loading-subtitle">Gathering insights from your feedback data</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="admin-dashboard-root">
        <div className="error-container">
          <div className="error-icon">📊</div>
          <h2>Unable to load dashboard data</h2>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const totalFeedback = Object.values(summary.category).reduce((a, b) => a + b, 0);
  const categories = Object.keys(summary.category).length;
  const positiveCount = summary.sentiment['Positive'] || 0;
  const satisfactionRate = totalFeedback > 0 ? Math.round((positiveCount / totalFeedback) * 100) : 0;

  // Chart color definitions
  const pieColors = ['#8937ff', '#b580fc', '#6d29e7', '#9f5bff', '#7c40fa'];
  const barColors = ['#ffc94d', '#ffe89e', '#ffb366'];
  const lineColor = '#8937ff';

  const pieData: ChartData<'pie'> = {
    labels: Object.keys(summary.category),
    datasets: [{
      label: 'Feedback Categories',
      data: Object.values(summary.category),
      backgroundColor: pieColors,
      borderWidth: 3,
      borderColor: '#fff'
    }]
  };

  const barData: ChartData<'bar'> = {
    labels: Object.keys(summary.sentiment),
    datasets: [{
      label: 'Feedback Sentiment',
      data: Object.values(summary.sentiment),
      backgroundColor: barColors,
      borderRadius: 8,
      borderSkipped: false
    }]
  };

  const lineData: ChartData<'line'> = {
    labels: Object.keys(summary.date),
    datasets: [{
      label: 'Feedback Over Time',
      data: Object.values(summary.date),
      borderColor: lineColor,
      backgroundColor: 'rgba(137, 55, 255, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: lineColor,
      pointBorderWidth: 3,
      pointRadius: 6
    }]
  };

  // ChartJS options -- font.weight must be 'bold' or another allowed string/number
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: { weight: 'bold' as const, size: 12 },
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(137, 55, 255, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#b580fc',
        borderWidth: 2
      }
    },
    scales: {
      x: {
        ticks: { color: '#fff', font: { weight: 'bold' as const } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#fff', font: { weight: 'bold' as const } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  // Provide correct typing for pie options, including bottom legend position
  const pieOptions: ChartOptions<'pie'> = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'bottom'
      }
    }
  };

  return (
    <div className="admin-dashboard-root">
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

      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="dashboard-title">
              <span className="title-icon">📊</span>
              Admin Analytics Hub
            </h1>
            <p className="dashboard-subtitle">Comprehensive insights into user feedback</p>
          </div>
          <div className="quick-stats">
            <div className="quick-stat-item">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <div className="stat-number">{totalFeedback}</div>
                <div className="stat-label">Total Feedback</div>
              </div>
            </div>
            <div className="quick-stat-item">
              <div className="stat-icon">📂</div>
              <div className="stat-content">
                <div className="stat-number">{categories}</div>
                <div className="stat-label">Categories</div>
              </div>
            </div>
            <div className="quick-stat-item">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-number">{satisfactionRate}%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid - Reverse Pyramid Layout */}
      <div className="charts-container">
        <div className="charts-pyramid">
          {/* Top Row - Single Chart (Category) */}
          <div className="chart-row top-row">
            <div className="chart-card category-chart">
              <div className="chart-header">
                <h3 className="chart-title">
                  <span className="chart-icon">🥧</span>
                  Category Distribution
                </h3>
                <div className="chart-subtitle">Feedback breakdown by category</div>
              </div>
              <div className="chart-content">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          </div>

          {/* Bottom Row - Two Charts (Sentiment & Trends) */}
          <div className="chart-row bottom-row">
            <div className="chart-card sentiment-chart">
              <div className="chart-header">
                <h3 className="chart-title">
                  <span className="chart-icon">😊</span>
                  Sentiment Analysis
                </h3>
                <div className="chart-subtitle">User sentiment breakdown</div>
              </div>
              <div className="chart-content">
                <Bar data={barData} options={chartOptions as ChartOptions<'bar'>} />
              </div>
            </div>

            <div className="chart-card trends-chart">
              <div className="chart-header">
                <h3 className="chart-title">
                  <span className="chart-icon">📈</span>
                  Feedback Trends
                </h3>
                <div className="chart-subtitle">Feedback volume over time</div>
              </div>
              <div className="chart-content">
                <Line data={lineData} options={chartOptions as ChartOptions<'line'>} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <div className="insights-header">
          <h2 className="insights-title">Key Insights</h2>
        </div>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Most Active Category</h4>
              <p>
                {Object.keys(summary.category).reduce((a, b) =>
                  summary.category[a] > summary.category[b] ? a : b
                )}
              </p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">⭐</div>
            <div className="insight-content">
              <h4>Dominant Sentiment</h4>
              <p>
                {Object.keys(summary.sentiment).reduce((a, b) =>
                  summary.sentiment[a] > summary.sentiment[b] ? a : b
                )}
              </p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>Avg. Daily Feedback</h4>
              <p>
                {Object.keys(summary.date).length > 0
                  ? Math.round(totalFeedback / Object.keys(summary.date).length)
                  : 0} per day
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="dashboard-footer">
        <div className="footer-content">
          <p>
            <span className="footer-icon">💡</span>
            Need deeper insights? Export data or explore advanced analytics features
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
