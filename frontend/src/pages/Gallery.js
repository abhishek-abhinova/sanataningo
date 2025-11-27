import React from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  const [activeTab, setActiveTab] = React.useState('photos');

  const galleryImages = [
    { id: 1, url: '/images/photo1.jpeg', caption: 'Community Service Program', category: 'service' },
    { id: 2, url: '/images/photo2.jpeg', caption: 'Cultural Event', category: 'cultural' },
    { id: 3, url: '/images/photo3.jpeg', caption: 'Educational Initiative', category: 'education' },
    { id: 4, url: '/images/photo4.jpeg', caption: 'Spiritual Gathering', category: 'spiritual' },
    { id: 5, url: '/images/photo5.jpeg', caption: 'Charity Drive', category: 'charity' },
    { id: 6, url: '/images/p1.jpeg', caption: 'Founder Meeting', category: 'leadership' },
    { id: 7, url: '/images/p2.jpeg', caption: 'Team Discussion', category: 'leadership' },
    { id: 8, url: '/images/p3.jpeg', caption: 'Planning Session', category: 'leadership' },
    { id: 9, url: '/images/p4.jpeg', caption: 'Leadership Meeting', category: 'leadership' }
  ];

  const galleryVideos = [
    { id: 1, url: '/videos/1.mp4', caption: 'Sanatan Dharma Awareness Program', category: 'spiritual', duration: '3:45' },
    { id: 2, url: '/videos/2.mp4', caption: 'Community Health Camp Initiative', category: 'service', duration: '5:20' },
    { id: 3, url: '/videos/3.mp4', caption: 'Educational Scholarship Distribution', category: 'education', duration: '4:15' },
    { id: 4, url: '/videos/4.mp4', caption: 'Cultural Heritage Festival', category: 'cultural', duration: '6:30' },
    { id: 5, url: '/videos/5.mp4', caption: 'Food Distribution Drive', category: 'charity', duration: '4:20' },
    { id: 6, url: '/videos/6.mp4', caption: 'Youth Leadership Workshop', category: 'leadership', duration: '3:15' },
    { id: 7, url: '/videos/7.mp4', caption: 'Environmental Conservation Project', category: 'environment', duration: '2:45' },
    { id: 8, url: '/videos/8.mp4', caption: 'Women Empowerment Seminar', category: 'empowerment', duration: '5:10' },
    { id: 9, url: '/videos/9.mp4', caption: 'Rural Development Initiative', category: 'development', duration: '4:30' },
    { id: 10, url: '/videos/10.mp4', caption: 'Medical Assistance Program', category: 'healthcare', duration: '3:20' },
    { id: 11, url: '/videos/12.mp4', caption: 'Skill Development Training', category: 'training', duration: '4:50' }
  ];

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

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem'
            }}>
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
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
                    cursor: 'pointer'
                  }}
                >
                  <img 
                    src={image.url} 
                    alt={image.caption}
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
                      {image.caption}
                    </h4>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0, textTransform: 'capitalize' }}>
                      {image.category.replace('_', ' ')} Program
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '2rem'
            }}>
              {galleryVideos.map((video, index) => (
                <motion.div
                  key={video.id}
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
                    <video 
                      controls
                      preload="metadata"
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
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
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    <div style={{
                      display: 'none',
                      height: '250px',
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
                      {video.duration}
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.5rem' }}>
                    <h4 style={{ 
                      color: '#333', 
                      marginBottom: '0.5rem', 
                      fontSize: '1.1rem', 
                      fontWeight: '600' 
                    }}>
                      {video.caption}
                    </h4>
                    <p style={{ 
                      color: '#666', 
                      fontSize: '0.9rem', 
                      margin: 0, 
                      textTransform: 'capitalize' 
                    }}>
                      {video.category.replace('_', ' ')} Program
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;