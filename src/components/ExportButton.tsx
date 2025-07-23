// import { useAuthStore } from '../store/authStore';
import api from '../utils/api'; // Adjust the import path based on your file structure

const ExportButton = () => {
  const handleExport = async () => {
    try {
      const response = await api.get('/api/FeedbackExport/excel', {
        responseType: 'blob' // Important for file downloads
      });

      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'feedbacks.csv';
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exporting data. Please try again.' + err);
    }
  };

  return (
    <button onClick={handleExport} style={exportBtnStyle}>
      📥 Export Feedbacks as CSV
    </button>
  );
};

const exportBtnStyle = {
  marginTop: '1rem',
  background: '#007bff',
  color: 'white',
  padding: '0.7rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  transition: '0.3s ease'
};

export default ExportButton;
