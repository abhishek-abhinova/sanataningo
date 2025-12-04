import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { API_BASE_URL } from '../config/api';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [galleryData, setGalleryData] = useState({ photos: [], videos: [] });
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cloudinary/gallery');
      const apiData = Array.isArray(response.data.gallery) ? response.data.gallery : [];
      
      // Separate photos and videos from API
      const apiPhotos = apiData.filter(item => item.type === 'photo' || !item.type);
      const apiVideos = apiData.filter(item => item.type === 'video');
      
      // Use only database data
      setGalleryData({
        photos: apiPhotos,
        videos: apiVideos
      });
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      // Use empty arrays on error
      setGalleryData({
        photos: [],
        videos: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-camera-retro"></i> Gallery</h1>
          <p><i className="fas fa-star-of-david"></i> Glimpses of our activities and events <i className="fas fa-star-of-david"></i></p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2>Media Gallery</h2>
            <p className="section-subtitle">Explore photos and videos from our various programs and activities</p>
            
            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '2rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setActiveTab('photos')}
                style={{
                  padding: '12px 30px',
                  borderRadius: '25px',
                  border: 'none',
                  background: activeTab === 'photos' ? 'linear-gradient(135deg, #d2691e, #ff8c00)' : 'white',
                  color: activeTab === 'photos' ? 'white' : '#8B4513',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === 'photos' ? '0 8px 25px rgba(210, 105, 30, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
                  fontSize: '1rem'
                }}
              >
                <i className="fas fa-camera" style={{ marginRight: '8px' }}></i>
                Photos
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                style={{
                  padding: '12px 30px',
                  borderRadius: '25px',
                  border: 'none',
                  background: activeTab === 'videos' ? 'linear-gradient(135deg, #d2691e, #ff8c00)' : 'white',
                  color: activeTab === 'videos' ? 'white' : '#8B4513',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === 'videos' ? '0 8px 25px rgba(210, 105, 30, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
                  fontSize: '1rem'
                }}
              >
                <i className="fas fa-video" style={{ marginRight: '8px' }}></i>
                Videos
              </button>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ 
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #d2691e',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ marginTop: '1rem', color: '#666' }}>Loading gallery...</p>
            </div>
          )}

          {/* Photos Tab */}
          {!loading && activeTab === 'photos' && (
            <div style={{ 
              columns: window.innerWidth < 768 ? '1' : window.innerWidth < 1024 ? '2' : '300px',
              columnGap: '1.5rem'
            }}>
              {galleryData.photos.map((image, index) => {
                const raw = image.image || image.image_url || '';
                let src = '';
                if (!raw) {
                  src = '/images/photo1.jpeg';
                } else if (raw.startsWith('/images/')) {
                  // Serve directly from frontend public assets
                  src = raw;
                } else if (raw.startsWith('http')) {
                  src = raw;
                } else {
                  // Default: backend-served file (uploads)
                  src = `${API_BASE_URL}/${raw.replace(/^\/+/, '')}`;
                }

                return (
                <motion.div
                  key={image._id || image.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onMouseEnter={(e) => {
                    const overlay = e.currentTarget.querySelector('.gallery-overlay');
                    if (overlay) overlay.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const overlay = e.currentTarget.querySelector('.gallery-overlay');
                    if (overlay) overlay.style.opacity = '0';
                  }}
                  style={{
                    position: 'relative',
                    height: 'auto',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    breakInside: 'avoid',
                    marginBottom: '1.5rem',
                    display: 'inline-block',
                    width: '100%'
                  }}
                >
                  <img 
                    src={src}
                    alt={image.title || image.caption}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                    color: 'white',
                    padding: '1.5rem',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                  className="gallery-overlay"
                  >
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
                      {image.title || image.caption || 'Untitled'}
                    </h4>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0, textTransform: 'capitalize' }}>
                      {(image.category || 'general').replace('_', ' ')} Program
                    </p>
                  </div>
                </motion.div>
              );})}
            </div>
          )}

          {/* Videos Tab */}
          {!loading && activeTab === 'videos' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', 
              gap: '2rem'
            }}>
              {galleryData.videos.map((video, index) => {
                const raw = video.image || video.image_url || '';
                let src = '';
                if (!raw) {
                  src = '/videos/1.mp4';
                } else if (raw.startsWith('/videos/')) {
                  // Frontend public assets (sample videos)
                  src = raw;
                } else if (raw.startsWith('http')) {
                  src = raw;
                } else {
                  src = `${API_BASE_URL}/${raw.replace(/^\/+/, '')}`;
                }

                const isYouTube = raw.includes('youtube.com') || raw.includes('youtu.be');

                return (
                <motion.div
                  key={video._id || video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    {isYouTube ? (
                      <iframe
                        src={src}
                        title={video.title || 'Gallery video'}
                        style={{
                          width: '100%',
                          height: '230px',
                          border: 'none',
                          display: 'block'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const nextElement = e.target.nextElementSibling;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                    ) : (
                      <video 
                        controls
                        preload="metadata"
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '400px',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const nextElement = e.target.nextElementSibling;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      >
                        <source src={src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    
                    <div style={{
                      display: 'none',
                      minHeight: '200px',
                      background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      color: '#666'
                    }}>
                      <i className="fas fa-video" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#d2691e' }}></i>
                      <p style={{ margin: 0, fontSize: '1rem' }}>Video Coming Soon</p>
                    </div>
                    
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {video.duration || '0:00'}
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.5rem' }}>
                    <h4 style={{ 
                      color: '#333', 
                      marginBottom: '0.5rem', 
                      fontSize: '1.1rem', 
                      fontWeight: '600' 
                    }}>
                      {video.title || video.caption || 'Untitled'}
                    </h4>
                    <p style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      margin: 0, 
                      textTransform: 'capitalize' 
                    }}>
                      {(video.category || 'general').replace('_', ' ')} Program
                    </p>
                  </div>
                </motion.div>
              );})}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
