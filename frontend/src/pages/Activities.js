import React from 'react';
import { motion } from 'framer-motion';

const Activities = () => {
  const activities = [
    {
      title: 'Educational Programs',
      description: 'Promoting education and literacy in underserved communities through scholarships, free classes, and educational material distribution.',
      icon: 'fas fa-book-open',
      image: '/images/photo1.jpeg',
      stats: '500+ Students Helped'
    },
    {
      title: 'Healthcare Services',
      description: 'Providing medical assistance and health awareness programs including free health camps, medicine distribution, and health education.',
      icon: 'fas fa-hand-holding-heart',
      image: '/images/photo2.jpeg',
      stats: '200+ Health Camps'
    },
    {
      title: 'Cultural Preservation',
      description: 'Preserving and promoting Sanatan Dharma traditions and values through cultural events, workshops, and educational programs.',
      icon: 'fas fa-om',
      image: '/images/photo3.jpeg',
      stats: '100+ Cultural Events'
    },
    {
      title: 'Community Development',
      description: 'Empowering communities through various development initiatives including skill development, women empowerment, and rural development.',
      icon: 'fas fa-people-carry',
      image: '/images/photo4.jpeg',
      stats: '50+ Communities Served'
    },
    {
      title: 'Disaster Relief',
      description: 'Providing immediate relief and rehabilitation support during natural disasters and emergencies across the country.',
      icon: 'fas fa-hands-helping',
      image: '/images/photo5.jpeg',
      stats: '25+ Relief Operations'
    },
    {
      title: 'Spiritual Guidance',
      description: 'Offering spiritual counseling, meditation sessions, and dharmic teachings to help individuals find inner peace and purpose.',
      icon: 'fas fa-praying-hands',
      image: '/images/photo1.jpeg',
      stats: '1000+ Lives Touched'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-om"></i> What We Do</h1>
          <p><i className="fas fa-lotus"></i> Discover our various programs and initiatives serving humanity <i className="fas fa-lotus"></i></p>
        </div>
      </section>

      {/* Activities Overview */}
      <section className="content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Our Activities</h2>
            <p className="section-subtitle">We are committed to serving society through various programs that address different aspects of human welfare and spiritual development.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                className="activity-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                style={{
                  background: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="activity-image" style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={activity.image} 
                    alt={activity.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    className="activity-photo"
                  />
                  <div className="activity-overlay" style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #d2691e, #ff8c00)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
                  }}>
                    <i className={activity.icon}></i>
                  </div>
                </div>
                
                <div className="activity-content" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.5rem', color: '#333', fontSize: '1.1rem' }}>
                    {activity.title}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                    {activity.description}
                  </p>
                  <div className="activity-stats" style={{
                    display: 'inline-block',
                    padding: '0.4rem 1rem',
                    background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    boxShadow: '0 3px 10px rgba(255, 215, 0, 0.3)'
                  }}>
                    {activity.stats}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              Our Impact
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', position: 'relative', zIndex: 1 }}>
              {[
                { number: '10,000+', label: 'Lives Touched', desc: 'Through our various programs' },
                { number: '500+', label: 'Volunteers', desc: 'Dedicated to service' },
                { number: '100+', label: 'Events', desc: 'Organized annually' },
                { number: '25+', label: 'States', desc: 'Across India' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{
                    y: -10,
                    background: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    color: '#ffd700',
                    marginBottom: '0.5rem',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {stat.number}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {stat.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#ffd700' }}>
              Join Our Mission
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.9, lineHeight: 1.6 }}>
              Be part of our noble cause and help us create a positive impact in society. Together, we can build a better world rooted in dharmic values.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
              <motion.a
                href="/membership"
                className="btn btn-primary"
                style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: '600' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-users"></i> Become a Member
              </motion.a>
              <motion.a
                href="/donate"
                className="btn btn-secondary"
                style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: '600' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-heart"></i> Make a Donation
              </motion.a>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                { icon: 'fas fa-check', text: 'Tax Benefits Available' },
                { icon: 'fas fa-shield-alt', text: 'Secure Donations' },
                { icon: 'fas fa-certificate', text: 'Transparent Operations' }
              ].map((feature, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  <i className={feature.icon} style={{ color: '#ffd700', fontSize: '1.1rem' }}></i>
                  {feature.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Activities;