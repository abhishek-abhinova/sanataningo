import React, { useState } from 'react';
import api from '../utils/api';

const TeamUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image || !formData.name || !formData.position) {
      setMessage('Please fill all required fields and select an image');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const uploadData = new FormData();
      uploadData.append('teamImage', image);
      uploadData.append('name', formData.name);
      uploadData.append('position', formData.position);
      uploadData.append('description', formData.description);

      const response = await api.post('/media/team-upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage('Team member uploaded successfully!');
        setFormData({ name: '', position: '', description: '' });
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      border: '1px solid #e1e5e9'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#8b4513', 
        marginBottom: '2rem',
        fontSize: '1.5rem'
      }}>
        Upload Team Member
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600',
            color: '#333'
          }}>
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#d2691e'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600',
            color: '#333'
          }}>
            Position *
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#d2691e'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600',
            color: '#333'
          }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#d2691e'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600',
            color: '#333'
          }}>
            Team Member Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px dashed #d2691e',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              background: '#fafbfc'
            }}
          />
          {preview && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          )}
        </div>

        {message && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center',
            background: message.includes('success') ? '#d4edda' : '#f8d7da',
            color: message.includes('success') ? '#155724' : '#721c24',
            border: `1px solid ${message.includes('success') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          style={{
            width: '100%',
            padding: '14px',
            background: uploading ? '#ccc' : 'linear-gradient(135deg, #d2691e, #ff8c00)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Team Member'}
        </button>
      </form>
    </div>
  );
};

export default TeamUpload;