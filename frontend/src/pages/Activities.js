import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { API_BASE_URL } from '../config/api';

// Events Section Component
const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/public/events?limit=50');
      if (response.data.success && response.data.events && response.data.events.length > 0) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/photo1.jpeg';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${API_BASE_URL}${imageUrl}`;
    return `${API_BASE_URL}/${imageUrl}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date TBA';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date TBA';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return '#28a745';
      case 'ongoing': return '#ffc107';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#007bff';
    }
  };

  // Don't render if no events
  if (loading) {
    return null; // Don't show loading, just wait
  }

  if (events.length === 0) {
    return null; // Don't show section if no events
  }

  return (
    <section className="content-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ textAlign: 'left' }}>Our Events</h2>
          <p className="section-subtitle" style={{ textAlign: 'left' }}>Join us for our upcoming events and programs that bring our community together.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          {events.map((event, index) => (
            <motion.div
              key={event.id || event._id || index}
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
                transition: 'all 0.3s ease',
                width: '100%',
                maxWidth: '350px',
                height: 'auto',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="activity-image" style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img 
                  src={getImageUrl(event.image || event.image_url)} 
                  alt={event.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  className="activity-photo"
                  onError={(e) => {
                    e.target.src = '/images/photo1.jpeg';
                  }}
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
                  <i className="fas fa-calendar-alt"></i>
                </div>
              </div>
              
              <div className="activity-content" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '0.5rem', color: '#333', fontSize: '1.1rem', minHeight: '2.5rem' }}>
                  {event.title}
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem', flex: 1, minHeight: '3rem' }}>
                  {event.description || 'No description available'}
                </p>
                <div className="event-details" style={{ display: 'flex', gap: '1rem', margin: '1rem 0', flexWrap: 'wrap' }}>
                  {event.event_date && (
                    <small style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-calendar"></i> {formatDate(event.event_date)}
                    </small>
                  )}
                  {event.location && (
                    <small style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-map-marker-alt"></i> {event.location}
                    </small>
                  )}
                </div>
                <div className="activity-stats" style={{
                  display: 'inline-block',
                  padding: '0.4rem 1rem',
                  background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  boxShadow: '0 3px 10px rgba(255, 215, 0, 0.3)',
                  textTransform: 'capitalize',
                  marginTop: 'auto'
                }}>
                  {event.status || 'Upcoming'} Event
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/public/activities?limit=50');
      if (response.data.success) {
        setActivities(response.data.activities || []);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      // Fallback to empty array on error
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/photo1.jpeg'; // Default fallback image
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${API_BASE_URL}${imageUrl}`;
    return `${API_BASE_URL}/${imageUrl}`;
  };

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

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
              <p>Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
              <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <p>No activities available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id || activity._id || index}
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
                      src={getImageUrl(activity.image || activity.image_url)} 
                      alt={activity.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      className="activity-photo"
                      onError={(e) => {
                        e.target.src = '/images/photo1.jpeg';
                      }}
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
                      <i className={activity.icon || 'fas fa-star'}></i>
                    </div>
                  </div>
                  
                  <div className="activity-content" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem', color: '#333', fontSize: '1.1rem' }}>
                      {activity.title}
                    </h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                      {activity.description || 'No description available'}
                    </p>
                    {activity.created_at && (
                      <p style={{ color: '#999', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                        <i className="fas fa-calendar"></i> {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    )}
                    {activity.stats && (
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
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <EventsSection />

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