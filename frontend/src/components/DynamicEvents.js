import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const DynamicEvents = ({ status = 'upcoming', limit = 6, homepage = false }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [status, limit, homepage]);

  const fetchEvents = async () => {
    try {
      let endpoint = '/public/events';
      const params = new URLSearchParams();
      
      if (status !== 'all') params.append('status', status);
      params.append('limit', limit.toString());
      
      if (homepage) endpoint = '/public/events/upcoming';
      
      const response = await api.get(`${endpoint}${params.toString() ? '?' + params.toString() : ''}`);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      time: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const getStatusColor = (eventStatus) => {
    switch(eventStatus) {
      case 'upcoming': return '#28a745';
      case 'ongoing': return '#ffc107';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#007bff';
    }
  };

  if (loading) {
    return (
      <div className="events-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="no-events">
        <div className="no-events-icon">
          <i className="fas fa-calendar-times"></i>
        </div>
        <h3>No Events Available</h3>
        <p>Check back soon for upcoming events and activities.</p>
      </div>
    );
  }

  return (
    <div className="dynamic-events">
      <div className="events-grid">
        {events.map((event) => {
          const eventDate = formatDate(event.eventDate);
          return (
            <div key={event._id} className="event-card">
              <div className="event-date">
                <div className="date-day">{eventDate.day}</div>
                <div className="date-month">{eventDate.month}</div>
                <div className="date-year">{eventDate.year}</div>
              </div>
              
              {event.banner && (
                <div className="event-banner">
                  <img 
                    src={event.banner} 
                    alt={event.title}
                    onError={(e) => {
                      e.target.src = '/images/event-placeholder.jpg';
                    }}
                  />
                </div>
              )}
              
              <div className="event-content">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <span 
                    className="event-status"
                    style={{ backgroundColor: getStatusColor(event.status) }}
                  >
                    {event.status.toUpperCase()}
                  </span>
                </div>
                
                <p className="event-description">{event.description}</p>
                
                <div className="event-details">
                  <div className="event-detail">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{eventDate.time}</span>
                  </div>
                  
                  {event.venue && (
                    <div className="event-detail">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{event.venue}</span>
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="event-detail">
                      <i className="fas fa-location-arrow"></i>
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                
                {event.images && event.images.length > 0 && (
                  <div className="event-images">
                    {event.images.slice(0, 3).map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`${event.title} ${index + 1}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ))}
                    {event.images.length > 3 && (
                      <div className="more-images">
                        +{event.images.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .dynamic-events {
          padding: 2rem 0;
        }
        .events-loading, .no-events {
          text-align: center;
          padding: 3rem;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #d2691e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .no-events-icon {
          font-size: 4rem;
          color: #d2691e;
          margin-bottom: 1rem;
        }
        .no-events h3 {
          color: #8b4513;
          margin-bottom: 0.5rem;
        }
        .no-events p {
          color: #666;
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .event-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }
        .event-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }
        .event-date {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #8b4513, #d2691e);
          color: white;
          padding: 1rem;
          border-radius: 10px;
          text-align: center;
          z-index: 2;
          min-width: 60px;
        }
        .date-day {
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 1;
        }
        .date-month {
          font-size: 0.8rem;
          text-transform: uppercase;
          margin: 0.25rem 0;
        }
        .date-year {
          font-size: 0.7rem;
          opacity: 0.8;
        }
        .event-banner {
          height: 200px;
          overflow: hidden;
        }
        .event-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .event-content {
          padding: 1.5rem;
          padding-top: ${event => event.banner ? '1.5rem' : '4rem'};
        }
        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .event-header h3 {
          color: #8b4513;
          margin: 0;
          flex: 1;
          margin-right: 1rem;
          font-size: 1.2rem;
        }
        .event-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .event-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .event-details {
          margin-bottom: 1rem;
        }
        .event-detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }
        .event-detail i {
          color: #d2691e;
          width: 16px;
        }
        .event-images {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .event-images img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }
        .more-images {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #666;
          border: 2px dashed #ddd;
        }
        @media (max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .event-card {
            margin: 0 0.5rem;
          }
          .event-date {
            top: 0.5rem;
            left: 0.5rem;
            padding: 0.75rem;
            min-width: 50px;
          }
          .date-day {
            font-size: 1.2rem;
          }
          .event-header {
            flex-direction: column;
            gap: 0.5rem;
          }
          .event-header h3 {
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicEvents;