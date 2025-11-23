import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
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
            <h3>Our Services</h3>
            <ul>
              <li>📚 Educational Programs</li>
              <li>🏥 Healthcare Services</li>
              <li>🎭 Cultural Preservation</li>
              <li>🤝 Community Development</li>
              <li>🆘 Disaster Relief</li>
              <li>🧘 Spiritual Guidance</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>🏢 Contact Information</h3>
            <div className="contact-info-premium">
              <p><i className="fas fa-map-marker-alt"></i> <strong>Registered Office:</strong><br/>
                 19, Kalyan Kunj, Sector 49<br/>
                 Gautam Buddha Nagar, Uttar Pradesh-231301</p>
              
              <div className="officials-contact">
                <p><i className="fas fa-phone"></i> <strong>Key Officials:</strong></p>
                <div className="official-list">
                  <p>📞 Shri Goutam Chandra Biswas (President): +91 9876543210</p>
                  <p>📞 Shri Ajit Ray (Secretary): +91 9876543211</p>
                  <p>📞 Shri Amiyo Govinda Biswas: +91 9876543212</p>
                  <p>📞 Shri Pratap Malik: +91 9876543213</p>
                </div>
              </div>
              
              <p><i className="fas fa-envelope"></i> info@sarboshaktisonatanisangathan.org</p>
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