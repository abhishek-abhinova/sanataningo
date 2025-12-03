import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          <div className="footer-section">
            <h3>🕉️ Sarbo Shakti Sonatani Sangathan</h3>
            <p>
              A non-profit organization dedicated to serving humanity through the eternal principles of Sanatan Dharma. 
              We work towards cultural preservation, community development, and spiritual upliftment.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/share/1G7CvWCqd8/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/activities">What We Do</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/membership">Become a Member</Link></li>
              <li><Link to="/donate">Donate</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>



          <div className="footer-section">
            <h3>🏢 Official</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#d2691e', marginRight: '8px' }}></i>
                <strong>Registered Office:</strong><br/>
                <span style={{ marginLeft: '20px', display: 'block', marginTop: '0.5rem' }}>
                  19, Kalyan Kunj, Sector 49<br/>
                  Gautam Buddha Nagar, UP-231301
                </span>
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ marginBottom: '0.8rem', fontWeight: 'bold' }}>
                  <i className="fas fa-users" style={{ color: '#d2691e', marginRight: '8px' }}></i>
                  Key Officials:
                </p>
                <div style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                  <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                    <i className="fas fa-phone" style={{ color: '#28a745', marginRight: '5px' }}></i>
                    Mr. Ajit Kumar Ray<br/>
                    <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '15px' }}>Chief General Secretary: +91 9907916429</span>
                  </p>
                  <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                    <i className="fas fa-phone" style={{ color: '#28a745', marginRight: '5px' }}></i>
                    Shri Goutam Chandra Biswas<br/>
                    <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '15px' }}>Cashier: +91 9868362375</span>
                  </p>
                  <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                    <i className="fas fa-phone" style={{ color: '#28a745', marginRight: '5px' }}></i>
                    Shriwas Halder<br/>
                    <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '15px' }}>Official Secretary: +91 9816195600</span>
                  </p>
                  <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                    <i className="fas fa-phone" style={{ color: '#28a745', marginRight: '5px' }}></i>
                    Mr. Dinesh Bairagi<br/>
                    <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '15px' }}>President & Founder: +91 8584871180</span>
                  </p>
                </div>
              </div>
              
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                <i className="fas fa-envelope" style={{ color: '#17a2b8', marginRight: '8px' }}></i>
                info@sarboshaktisonatanisangathan.org
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h3>🎧 Support</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ marginBottom: '0.8rem', fontWeight: 'bold' }}>
                  <i className="fas fa-headset" style={{ color: '#17a2b8', marginRight: '8px' }}></i>
                  Support Team:
                </p>
                <div style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                  <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                    <i className="fas fa-phone" style={{ color: '#28a745', marginRight: '5px' }}></i>
                    Shri Pratap Malik<br/>
                    <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '15px' }}>Support: +91 7827359897</span>
                  </p>
                  <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                    <i className="fas fa-phone" style={{ color: '#28a745', marginRight: '5px' }}></i>
                    Tarak Chandra Pal<br/>
                    <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '15px' }}>Support: +91 8826069880</span>
                  </p>
                  <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                    <i className="fas fa-phone" style={{ color: '#28a745', marginRight: '5px' }}></i>
                    Amiyo Biswas<br/>
                    <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '15px' }}>Support: +91 9765212583</span>
                  </p>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  <i className="fas fa-envelope" style={{ color: '#17a2b8', marginRight: '8px' }}></i>
                  Email Support:
                </p>
                <div style={{ marginLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <p style={{ margin: '0.2rem 0', color: '#666' }}>General: info@sarboshaktisonatanisangathan.org</p>
                  <p style={{ margin: '0.2rem 0', color: '#666' }}>Membership: info@sarboshaktisonatanisangathan.org</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Sarbo Shakti Sonatani Sangathan. All rights reserved.</p>
          <p>🙏 "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः" - May all beings be happy, may all beings be healthy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;