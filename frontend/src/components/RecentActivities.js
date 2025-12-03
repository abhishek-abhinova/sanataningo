import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { API_BASE_URL } from '../config/api';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (activities.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activities.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activities.length]);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/public/activities?limit=5');
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date not available';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/photo1.jpeg';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${API_BASE_URL}${imageUrl}`;
    return `${API_BASE_URL}/${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="activities-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return null;
  }

  return (
    <section className="recent-activities">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>
            <i className="fas fa-newspaper"></i>
            Recent Activities
          </h2>
          <p>Stay updated with our latest initiatives and community work</p>
        </motion.div>

        <div className="activities-slider">
          <div className="slider-container">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id || activity._id || index}
                className={`activity-slide ${index === currentSlide ? 'active' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="activity-content">
                  <div className="activity-image">
                    {activity.image || activity.image_url ? (
                      <img 
                        src={getImageUrl(activity.image || activity.image_url)}
                        alt={activity.title}
                        onError={(e) => {
                          e.target.src = '/images/photo1.jpeg';
                        }}
                      />
                    ) : (
                      <div className="placeholder-image">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                    )}
                    <div className="activity-category">
                      <span className={`category-badge ${activity.category || 'event'}`}>
                        {activity.category || 'Event'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="activity-info">
                    <div className="activity-date">
                      <i className="fas fa-calendar"></i>
                      {activity.created_at ? formatDate(activity.created_at) : 'Date not available'}
                    </div>
                    
                    <h3>{activity.title}</h3>
                    <p>{activity.description}</p>
                    
                    {activity.location && (
                      <div className="activity-location">
                        <i className="fas fa-map-marker-alt"></i>
                        {activity.location}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {activities.length > 1 && (
            <div className="slider-controls">
              <div className="slider-dots">
                {activities.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .recent-activities {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          color: #8b4513;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .section-header p {
          color: #666;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .activities-slider {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
        }

        .slider-container {
          position: relative;
          height: 400px;
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .activity-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
        }

        .activity-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100%;
        }

        .activity-image {
          position: relative;
          overflow: hidden;
        }

        .activity-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #d2691e, #ff8c00);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 4rem;
        }

        .activity-category {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .category-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .category-badge.event { background: #28a745; }
        .category-badge.service { background: #007bff; }
        .category-badge.achievement { background: #ffc107; color: #000; }
        .category-badge.announcement { background: #6f42c1; }
        .category-badge.donation { background: #dc3545; }

        .activity-info {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .activity-date {
          color: #d2691e;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .activity-info h3 {
          color: #8b4513;
          font-size: 1.8rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .activity-info p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        .activity-location {
          color: #888;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .slider-controls {
          margin-top: 2rem;
          text-align: center;
        }

        .slider-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: #ddd;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: #d2691e;
          transform: scale(1.2);
        }

        .activities-loading {
          text-align: center;
          padding: 4rem 0;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #d2691e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .activity-content {
            grid-template-columns: 1fr;
            grid-template-rows: 200px 1fr;
          }
          
          .activity-info {
            padding: 1.5rem;
          }
          
          .activity-info h3 {
            font-size: 1.4rem;
          }
          
          .section-header h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default RecentActivities;