import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../utils/api';
import './FeedbackForm.css';

interface FormErrors {
  category?: string;
  content?: string;
  image?: string;
}

interface FormTouched {
  category: boolean;
  content: boolean;
}

const FeedbackForm = () => {
  const [form, setForm] = useState({ category: '', content: '' });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({ category: false, content: false });
  const [showSuccess, setShowSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const MAX_CONTENT_LENGTH = 500;
  const MIN_CONTENT_LENGTH = 10;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};
    
    if (touched.category && !form.category.trim()) {
      newErrors.category = 'Please select a category';
    }
    
    if (touched.content) {
      if (!form.content.trim()) {
        newErrors.content = 'Feedback content is required';
      } else if (form.content.length < MIN_CONTENT_LENGTH) {
        newErrors.content = `Feedback must be at least ${MIN_CONTENT_LENGTH} characters`;
      } else if (form.content.length > MAX_CONTENT_LENGTH) {
        newErrors.content = `Feedback cannot exceed ${MAX_CONTENT_LENGTH} characters`;
      }
    }
    
    setErrors(newErrors);
  }, [form, touched]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    const file = acceptedFiles[0];
    
    if (rejectedFiles.length > 0) {
      setErrors(prev => ({ ...prev, image: 'Invalid file type. Please select an image.' }));
      return;
    }
    
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, image: 'File size too large. Maximum 5MB allowed.' }));
        return;
      }
      
      setErrors(prev => ({ ...prev, image: undefined }));
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    onDrop
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'content') {
      setCharCount(value.length);
    }
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setErrors(prev => ({ ...prev, image: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!form.category.trim()) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }

    if (!form.content.trim()) {
      newErrors.content = 'Feedback content is required';
      isValid = false;
    } else if (form.content.length < MIN_CONTENT_LENGTH) {
      newErrors.content = `Feedback must be at least ${MIN_CONTENT_LENGTH} characters`;
      isValid = false;
    } else if (form.content.length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Feedback cannot exceed ${MAX_CONTENT_LENGTH} characters`;
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({ category: true, content: true });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      setMessage('❌ Please fix the errors above');
      return;
    }

    const formData = new FormData();
    formData.append('category', form.category);
    formData.append('content', form.content);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      setLoading(true);
      await api.post('/api/Feedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowSuccess(true);
      setMessage('🎉 Thank you! Your feedback has been submitted successfully!');
      setForm({ category: '', content: '' });
      setSelectedImage(null);
      setImagePreview(null);
      setCharCount(0);
      setTouched({ category: false, content: false });
      setErrors({});
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setMessage('');
      }, 5000);
      
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && form.category && form.content;

  return (
    <div className="feedback-page-container">
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

      {/* Form Container */}
      <div className="feedback-glass-form">
        <div className="form-header">
          <h2 className="form-title">✨ Share Your Feedback</h2>
          <p className="form-subtitle">Help us improve by sharing your thoughts and experiences</p>
        </div>
        
        {showSuccess && (
          <div className="success-banner">
            <div className="success-icon">🎉</div>
            <div className="success-text">
              <h3>Feedback Submitted!</h3>
              <p>Thank you for taking the time to share your thoughts with us.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Category Selection */}
          <div className={`form-group ${form.category ? "filled" : ""} ${errors.category ? "error" : ""}`}>
            <label htmlFor="category">
              <span className="label-icon">📂</span>
              Category <span className="required">*</span>
            </label>
            <div className="select-wrapper">
              <select
                name="category"
                id="category"
                value={form.category}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <option value="">Choose a category...</option>
                <option value="Sports">⚽ Sports</option>
                <option value="Academics">📚 Academics</option>
                <option value="Events">🎉 Events</option>
                <option value="General">💬 General</option>
              </select>
              <div className="select-arrow">
                <svg width="12" height="8" viewBox="0 0 12 8">
                  <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          {/* Feedback Content */}
          <div className={`form-group ${form.content ? "filled" : ""} ${errors.content ? "error" : ""}`}>
            <label htmlFor="content">
              <span className="label-icon">💭</span>
              Your Feedback <span className="required">*</span>
            </label>
            <div className="textarea-wrapper">
              <textarea
                name="content"
                id="content"
                rows={4}
                onChange={handleChange}
                onBlur={handleBlur}
                value={form.content}
                placeholder="Share your thoughts, suggestions, or experiences..."
                required
              />
              <div className="char-counter">
                <span className={charCount > MAX_CONTENT_LENGTH ? 'over-limit' : ''}>
                  {charCount}/{MAX_CONTENT_LENGTH}
                </span>
              </div>
            </div>
            {errors.content && <span className="error-message">{errors.content}</span>}
          </div>

          {/* Image Upload */}
          <div className="upload-section">
            <label className="upload-text">
              <span className="label-icon">📸</span>
              Attach Image (Optional)
            </label>
            <div className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''} ${errors.image ? 'error' : ''}`} {...getRootProps()}>
              <input {...getInputProps()} />
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="preview-img" />
                  <button type="button" className="remove-image" onClick={removeImage}>
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="dropzone-content">
                  <div className="upload-icon">
                    {isDragActive ? '📤' : '📷'}
                  </div>
                  <p>
                    {isDragActive
                      ? 'Drop your image here'
                      : 'Drag & drop an image here, or click to select'}
                  </p>
                  <span className="upload-hint">PNG, JPG, GIF up to 5MB</span>
                </div>
              )}
            </div>
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''} ${isFormValid ? 'valid' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Feedback</span>
                <span className="submit-icon">🚀</span>
              </>
            )}
          </button>

          {/* Form Message */}
          {message && (
            <div className={`form-message ${showSuccess ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
