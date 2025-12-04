import React, { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ImprovedGalleryForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: data.title || '',
    description: data.description || '',
    category: data.category || 'general',
    featured: data.featured || false
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(data.image_url || '');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!selectedFile && !data._id) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to upload images');
        return;
      }

      let result;

      if (selectedFile) {
        // Upload new file to Cloudinary
        const uploadData = new FormData();
        
        // Determine if it's a video or image
        const isVideo = selectedFile.type.startsWith('video/');
        
        if (isVideo) {
          uploadData.append('video', selectedFile);
        } else {
          uploadData.append('image', selectedFile);
        }
        
        uploadData.append('title', formData.title);
        uploadData.append('description', formData.description);
        uploadData.append('category', formData.category);

        const uploadEndpoint = isVideo ? '/cloudinary/video' : '/cloudinary/gallery';

        console.log('🚀 Uploading to:', uploadEndpoint);
        console.log('📁 File type:', selectedFile.type);
        console.log('📝 Form data:', {
          title: formData.title,
          description: formData.description,
          category: formData.category
        });

        const response = await api.post(uploadEndpoint, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        result = response.data;
        
        if (result?.success) {
          toast.success(`${isVideo ? 'Video' : 'Image'} uploaded successfully to Cloudinary!`);
          console.log('✅ Upload successful:', result);
          
          // Clean up preview URL
          if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
          }
          
          onSave(result.data);
          return;
        } else {
          throw new Error(result?.message || 'Upload failed');
        }
      } else {
        // Update existing item without file change
        const updateData = { ...data, ...formData };
        onSave(updateData);
      }
    } catch (error) {
      console.error('❌ Upload failed:', error);
      
      // Provide specific error messages
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 413) {
        toast.error('File too large. Please select a smaller file.');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.error || 'Invalid file or data');
      } else if (error.response?.status === 404) {
        toast.error('Upload endpoint not found. Please check server configuration.');
      } else {
        toast.error(`Upload failed: ${error.response?.data?.error || error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ fontWeight: '600', color: '#333', display: 'block', marginBottom: '0.5rem' }}>
          Title *
        </label>
        <input
          type="text"
          placeholder="Enter title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          style={{ 
            width: '100%',
            padding: '0.75rem', 
            border: '2px solid #e2e8f0', 
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
      </div>

      <div>
        <label style={{ fontWeight: '600', color: '#333', display: 'block', marginBottom: '0.5rem' }}>
          Description
        </label>
        <textarea
          placeholder="Enter description (optional)"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          style={{ 
            width: '100%',
            padding: '0.75rem', 
            border: '2px solid #e2e8f0', 
            borderRadius: '8px', 
            minHeight: '100px',
            fontSize: '1rem',
            resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{ fontWeight: '600', color: '#333', display: 'block', marginBottom: '0.5rem' }}>
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          style={{ 
            width: '100%',
            padding: '0.75rem', 
            border: '2px solid #e2e8f0', 
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        >
          <option value="general">General</option>
          <option value="events">Events</option>
          <option value="activities">Activities</option>
          <option value="achievements">Achievements</option>
          <option value="temple">Temple</option>
          <option value="festival">Festival</option>
          <option value="featured">Featured</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
        />
        <label htmlFor="featured" style={{ fontWeight: '600', color: '#333' }}>
          Featured Item (Show on homepage)
        </label>
      </div>

      <div>
        <label style={{ fontWeight: '600', color: '#333', display: 'block', marginBottom: '0.5rem' }}>
          Select File * (Images or Videos)
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          required={!data._id}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px dashed #d2691e',
            borderRadius: '8px',
            cursor: 'pointer',
            background: '#fafbfc',
            fontSize: '1rem'
          }}
        />
        <small style={{ color: '#666', fontSize: '0.85rem' }}>
          Supported formats: JPG, PNG, GIF, MP4, WebM, AVI (Max 50MB)
        </small>
      </div>

      {uploading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '1rem',
          background: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          color: '#0369a1'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>📤 Uploading to Cloudinary...</div>
          <div style={{ fontSize: '0.9rem' }}>Please wait, this may take a moment for large files.</div>
        </div>
      )}

      {preview && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>
            Preview:
          </p>
          {selectedFile?.type.startsWith('video/') ? (
            <video
              src={preview}
              style={{ 
                width: '200px', 
                height: '150px', 
                objectFit: 'cover', 
                borderRadius: '8px', 
                border: '2px solid #e2e8f0' 
              }}
              controls
            />
          ) : (
            <img
              src={preview}
              alt="Preview"
              style={{ 
                width: '200px', 
                height: '150px', 
                objectFit: 'cover', 
                borderRadius: '8px', 
                border: '2px solid #e2e8f0' 
              }}
            />
          )}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'flex-end', 
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e2e8f0'
      }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={uploading}
          style={{
            padding: '0.75rem 1.5rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            background: 'white',
            color: '#64748b',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            opacity: uploading ? 0.6 : 1
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '0.75rem 1.5rem',
            background: uploading ? '#ccc' : 'linear-gradient(135deg, #d2691e, #ff8c00)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            boxShadow: uploading ? 'none' : '0 4px 15px rgba(210, 105, 30, 0.3)'
          }}
        >
          {uploading ? 'Uploading...' : (data._id ? 'Update' : 'Upload to Cloudinary')}
        </button>
      </div>
    </form>
  );
};

export default ImprovedGalleryForm;