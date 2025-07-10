import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../utils/api';

const FeedbackForm = () => {
  const [form, setForm] = useState({ category: '', content: '' });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.category || !form.content) {
      setMessage('Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('category', form.category);
    formData.append('content', form.content);
    if (selectedImage) {
      formData.append('image', selectedImage); // 👈 matches backend's IFormFile image
    }

    try {
      await api.post('/api/Feedback', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Feedback submitted successfully!');
      setForm({ category: '', content: '' });
      setSelectedImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while submitting.');
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Sports">Sports</option>
          <option value="Academics">Academics</option>
          <option value="Events">Events</option>
        </select>

        <label>Content</label>
        <textarea name="content" rows={4} onChange={handleChange} value={form.content} required />

        <label>Image Upload (optional)</label>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="preview-img" />
          ) : (
            <p>📷 Drag and drop an image here, or click to select a file</p>
          )}
        </div>

        <button type="submit" style={{ ...buttonStyle, background: '#1e88e5' }}>Submit</button>
        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </form>
    </div>
  );
};

const buttonStyle = {
  marginTop: '1rem',
  width: '100%',
  padding: '0.75rem',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer'
};

export default FeedbackForm;
