import React from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  const galleryImages = [
    { id: 1, url: '/images/photo1.jpeg', caption: 'Community Service Program', category: 'service' },
    { id: 2, url: '/images/photo2.jpeg', caption: 'Cultural Event', category: 'cultural' },
    { id: 3, url: '/images/photo3.jpeg', caption: 'Educational Initiative', category: 'education' },
    { id: 4, url: '/images/photo4.jpeg', caption: 'Spiritual Gathering', category: 'spiritual' },
    { id: 5, url: '/images/photo5.jpeg', caption: 'Charity Drive', category: 'charity' },
    { id: 6, url: '/images/p1.jpeg', caption: 'Founder Meeting', category: 'leadership' },
    { id: 7, url: '/images/p2.jpeg', caption: 'Team Discussion', category: 'leadership' },
    { id: 8, url: '/images/p3.jpeg', caption: 'Planning Session', category: 'leadership' }
  ];

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-images"></i> Gallery</h1>
          <p>Glimpses of our activities and events</p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Photo Gallery</h2>
            <p className="section-subtitle">Explore the moments captured during our various programs and activities</p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem', 
            marginTop: '3rem' 
          }}>
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                style={{
                  position: 'relative',
                  height: '250px',
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
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
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
                  padding: '2rem 1.5rem 1.5rem',
                  transform: 'translateY(100%)',
                  transition: 'transform 0.3s ease'
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

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ marginTop: '4rem' }}
          >
            <h2>Our Activities in Pictures</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '2rem', 
              marginTop: '2rem' 
            }}>
              {[
                { 
                  category: 'Community Service', 
                  icon: 'fas fa-hands-helping', 
                  description: 'Serving communities through various welfare programs',
                  count: '50+ Programs'
                },
                { 
                  category: 'Cultural Events', 
                  icon: 'fas fa-om', 
                  description: 'Preserving and promoting Sanatan culture and traditions',
                  count: '25+ Events'
                },
                { 
                  category: 'Educational Initiatives', 
                  icon: 'fas fa-graduation-cap', 
                  description: 'Promoting education and literacy in underserved areas',
                  count: '30+ Programs'
                },
                { 
                  category: 'Spiritual Gatherings', 
                  icon: 'fas fa-pray', 
                  description: 'Organizing spiritual sessions and dharmic teachings',
                  count: '40+ Sessions'
                }
              ].map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '15px',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(139, 69, 19, 0.15)',
                    transition: 'all 0.3s ease',
                    border: '1px solid #FFD700'
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #d2691e, #ff8c00)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'white',
                    fontSize: '2rem',
                    boxShadow: '0 10px 30px rgba(210, 105, 30, 0.3)'
                  }}>
                    <i className={category.icon}></i>
                  </div>
                  <h3 style={{ color: '#333', marginBottom: '1rem' }}>{category.category}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {category.description}
                  </p>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'inline-block',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                  }}>
                    {category.count}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section style={{ background: 'linear-gradient(135deg, #FFFBF0, #FFF8E7)', padding: '80px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <h2 style={{ color: '#8B4513', marginBottom: '2rem' }}>Watch Our Journey</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Experience our mission through videos showcasing our various programs and the impact we create in communities.
            </p>
            
            <div style={{
              background: 'white',
              padding: '3rem',
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(139, 69, 19, 0.15)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{
                background: '#f0f0f0',
                height: '300px',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>
                <i className="fas fa-play-circle" style={{ fontSize: '4rem', color: '#d2691e' }}></i>
              </div>
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Our Mission Video</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Coming Soon - A comprehensive video showcasing our journey and impact
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;