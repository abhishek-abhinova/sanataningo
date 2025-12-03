import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { API_BASE_URL } from '../config/api';

const DynamicGallery = ({ type = 'all', category, homepage = false, limit = 12 }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState(type);

  useEffect(() => {
    fetchGallery();
  }, [type, category, homepage]);

  const fetchGallery = async () => {
    try {
      let endpoint = '/public/gallery';
      const params = new URLSearchParams();
      
      if (type !== 'all') params.append('type', type);
      if (category) params.append('category', category);
      if (homepage) params.append('homepage', 'true');
      
      if (homepage) endpoint = '/public/gallery/homepage';
      
      const response = await api.get(`${endpoint}${params.toString() ? '?' + params.toString() : ''}`);
      setGallery(response.data.gallery || []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGallery = gallery.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const openLightbox = (item) => {
    setSelectedItem(item);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  if (gallery.length === 0) {
    return (
      <div className="no-gallery">
        <p>No gallery items available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="dynamic-gallery">
      {!homepage && (
        <div className="gallery-filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'photo' ? 'active' : ''}
            onClick={() => setFilter('photo')}
          >
            Photos
          </button>
          <button 
            className={filter === 'video' ? 'active' : ''}
            onClick={() => setFilter('video')}
          >
            Videos
          </button>
        </div>
      )}

      <div className="gallery-grid">
        {filteredGallery.slice(0, limit).map((item, index) => (
          <div key={item._id || item.id || index} className="gallery-item" onClick={() => openLightbox(item)}>
            <div className="media-container">
              {item.type === 'photo' ? (
                <img 
                  src={(item.image && (item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`)) || (item.thumbnail && (item.thumbnail.startsWith('http') ? item.thumbnail : `${API_BASE_URL}${item.thumbnail}`)) || (item.file && (item.file.startsWith('http') ? item.file : `${API_BASE_URL}${item.file}`))} 
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              ) : (
                <div className="video-thumbnail">
                  <video 
                    src={(item.image && (item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`)) || (item.file && (item.file.startsWith('http') ? item.file : `${API_BASE_URL}${item.file}`))} 
                    poster={item.thumbnail}
                    muted
                  />
                  <div className="play-button">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
              )}
              <div className="media-overlay">
                <h4>{item.title}</h4>
                {item.description && <p>{item.description}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeLightbox}>
              <i className="fas fa-times"></i>
            </button>
            <div className="lightbox-media">
            {selectedItem.type === 'photo' ? (
              <img src={(selectedItem.image && (selectedItem.image.startsWith('http') ? selectedItem.image : `${API_BASE_URL}${selectedItem.image}`)) || (selectedItem.file && (selectedItem.file.startsWith('http') ? selectedItem.file : `${API_BASE_URL}${selectedItem.file}`))} alt={selectedItem.title} />
            ) : (
              <video src={(selectedItem.image && (selectedItem.image.startsWith('http') ? selectedItem.image : `${API_BASE_URL}${selectedItem.image}`)) || (selectedItem.file && (selectedItem.file.startsWith('http') ? selectedItem.file : `${API_BASE_URL}${selectedItem.file}`))} controls autoPlay />
            )}
            </div>
            <div className="lightbox-info">
              <h3>{selectedItem.title}</h3>
              {selectedItem.description && <p>{selectedItem.description}</p>}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .dynamic-gallery {
          padding: 2rem 0;
        }
        .gallery-loading, .no-gallery {
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
        .gallery-filters {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .gallery-filters button {
          padding: 0.75rem 1.5rem;
          border: 2px solid #d2691e;
          background: white;
          color: #d2691e;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        .gallery-filters button:hover,
        .gallery-filters button.active {
          background: #d2691e;
          color: white;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .gallery-item {
          cursor: pointer;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .gallery-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }
        .media-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }
        .media-container img,
        .video-thumbnail video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .video-thumbnail {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: rgba(210, 105, 30, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }
        .media-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: white;
          padding: 2rem 1rem 1rem;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        .gallery-item:hover .media-overlay {
          transform: translateY(0);
        }
        .media-overlay h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }
        .media-overlay p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        .lightbox-content {
          max-width: 90vw;
          max-height: 90vh;
          position: relative;
        }
        .close-button {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          z-index: 1001;
        }
        .lightbox-media img,
        .lightbox-media video {
          max-width: 100%;
          max-height: 80vh;
          border-radius: 10px;
        }
        .lightbox-info {
          color: white;
          text-align: center;
          margin-top: 1rem;
        }
        .lightbox-info h3 {
          margin: 0 0 0.5rem 0;
        }
        .lightbox-info p {
          margin: 0;
          opacity: 0.8;
        }
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }
          .media-container {
            height: 200px;
          }
          .gallery-filters {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .gallery-filters button {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicGallery;
