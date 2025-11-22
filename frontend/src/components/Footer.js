import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🕉️ Sarboshakti Sanatani Sangathan</h3>
            <p>
              A non-profit organization dedicated to serving humanity through the eternal principles of Sanatan Dharma. 
              We work towards cultural preservation, community development, and spiritual upliftment.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
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
            <h3>Contact Info</h3>
            <p><i className="fas fa-map-marker-alt"></i> K-11, S/F, Gali No. 6, Old Gobind Pura, Delhi — 110051, India</p>
            <p><i className="fas fa-phone"></i> +91 9876543210</p>
            <p><i className="fas fa-envelope"></i> info@sarboshaktisonatanisangathan.org</p>
            <p><i className="fas fa-clock"></i> Mon-Fri: 9AM-6PM, Sat: 9AM-2PM</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Sarboshakti Sanatani Sangathan. All rights reserved.</p>
          <p>🙏 "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः" - May all beings be happy, may all beings be healthy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;