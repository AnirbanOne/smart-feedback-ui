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

  useEffect(() => {
    api.get('/api/Dashboard/summary')
      .then(res => setSummary(res.data))
      .catch(() => {});
  }, []);

  if (!summary) {
    return <div className="glass-card">Loading dashboard...</div>;
  }

  const pieData = {
    labels: Object.keys(summary.category),
    datasets: [{
      label: 'Feedback Categories',
      data: Object.values(summary.category),
      backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#ef5350'],
      borderWidth: 1
    }]
  };

  const barData = {
    labels: Object.keys(summary.sentiment),
    datasets: [{
      label: 'Feedback Sentiment',
      data: Object.values(summary.sentiment),
      backgroundColor: ['#4caf50', '#ffca28', '#f44336']
    }]
  };

  const lineData = {
    labels: Object.keys(summary.date),
    datasets: [{
      label: 'Feedback Over Time',
      data: Object.values(summary.date),
      borderColor: '#1e88e5',
      backgroundColor: 'rgba(30, 136, 229, 0.3)',
      tension: 0.3
    }]
  };

  return (
    <div className="glass-card">
      <h2>Admin Dashboard</h2>

      <div className="chart-container">
        <h4>By Category</h4>
        <Pie data={pieData} />

        <h4 style={{ marginTop: '2rem' }}>By Sentiment</h4>
        <Bar data={barData} />

        <h4 style={{ marginTop: '2rem' }}>Feedback Over Time</h4>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
