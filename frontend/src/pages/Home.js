import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [events, setEvents] = useState([]);
  
  const slides = [
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop'
  ];

  const values = [
    { icon: 'fas fa-om', title: 'Dharma', subtitle: 'Righteousness' },
    { icon: 'fas fa-praying-hands', title: 'Seva', subtitle: 'Selfless Service' },
    { icon: 'fas fa-sun', title: 'Satya', subtitle: 'Truth' },
    { icon: 'fas fa-dove', title: 'Karuna', subtitle: 'Compassion' },
    { icon: 'fas fa-globe-asia', title: 'Vasudhaiva Kutumbakam', subtitle: 'The World is One Family' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    // Fetch dynamic content
    fetchGalleryImages();
    fetchTeamMembers();
    fetchEvents();

    return () => clearInterval(interval);
  }, [slides.length]);

  const fetchGalleryImages = async () => {
    try {
      const response = await api.get('/gallery?homepage=true');
      setGalleryImages(response.data.images || []);
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/team?homepage=true');
      setTeamMembers(response.data.team || []);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events?published=true');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
        </div>
        <div className="hero-overlay"></div>

        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="hero-badge">
            <i className="fas fa-om"></i>
            <span>Established with Divine Purpose</span>
          </div>
          <h1>Sarboshakti Sanatani Sangathan</h1>
          <h2>Serving Humanity through the Light of Sanatan Dharma</h2>
          <p>A divine movement dedicated to Dharma, Seva, Sanskriti, and Samaj.<br />
          Join us in preserving the eternal values of Sanatan culture and uplifting every life with compassion and duty.</p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">1200+</div>
              <div className="stat-label">Active Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">75+</div>
              <div className="stat-label">Programs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">12+</div>
              <div className="stat-label">Years Serving</div>
            </div>
          </div>
          <div className="hero-buttons">
            <Link to="/membership" className="btn btn-primary">
              <i className="fas fa-users"></i>
              Become a Member
            </Link>
            <Link to="/donate" className="btn btn-secondary">
              <i className="fas fa-heart"></i>
              Donate Now
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="about-intro">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>About the Organization</h2>
            <p>Sarboshakti Sanatani Sangathan is a non-profit, socio-spiritual organization devoted to the service of humanity based on the eternal principles of Sanatan Dharma. We conduct welfare activities, spiritual programs, cultural preservation initiatives, education drives, and community upliftment efforts across the country.</p>
            <div className="mission-quote">
              <i className="fas fa-quote-left"></i>
              <p>Serve all, love all, protect dharma, uplift humanity.</p>
              <i className="fas fa-quote-right"></i>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="founders">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Founders
          </motion.h2>
          <div className="founders-grid">
            <motion.div
              className="founder-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="founder-image">
                <img src="images/p1.jpeg" alt="Founder 1" className="founder-photo" />
              </div>
              <h3>Shri Ajit Ray</h3>
              <h4><i className="fas fa-crown"></i> Founder</h4>
              <p>A devoted follower of Sanatan Sanskriti committed to serving society through dharma, awareness, and compassion. Leading the organization with spiritual wisdom and social vision.</p>
            </motion.div>
            <motion.div
              className="founder-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="founder-image">
                <img src="images/p2.jpeg" alt="Founder 2" className="founder-photo" />
              </div>
              <h3>Shri Dinesh Bairagi</h3>
              <h4><i className="fas fa-book-open"></i> Founder</h4>
              <p>A spiritual thinker and scholar guiding the Sangathan's cultural preservation and Sanatan awareness programs with deep knowledge of ancient scriptures.</p>
            </motion.div>
            <motion.div
              className="founder-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="founder-image">
                <img src="images/p3.jpeg" alt="Founder 3" className="founder-photo" />
              </div>
              <h3>Shri Shreebash Halder</h3>
              <h4><i className="fas fa-hands-helping"></i> Founder</h4>
              <p>Dedicated to executing social welfare activities, charity drives, and community upliftment programs with hands-on approach to serving the needy.</p>
            </motion.div>
            <motion.div
              className="founder-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="founder-image">
                <img src="images/p4.jpeg" alt="Founder 4" className="founder-photo" />
              </div>
              <h3>Shri Goutam Chandra Biswas</h3>
              <h4><i className="fas fa-seedling"></i> Founder</h4>
              <p>Works closely with the next generation to promote dharmic values, leadership development, and moral responsibility among youth and students.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Team Members Section */}
      <section className="content-section" style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', color: '#ff6b35', marginBottom: '3rem' }}
          >
            Our Team ({teamMembers.length > 0 ? teamMembers.length : '21'} Members)
          </motion.h2>
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {(teamMembers.length > 0 ? teamMembers : [
              { name: 'Aleep Biswas', photo: 'images/aleep-biswas.jpeg' },
              { name: 'Amiyo Govinda Biswas', photo: 'images/amiyo-govinda-biswas.jpeg' },
              { name: 'Arun Kumar Biswas', photo: 'images/arun-kumar-biswas.jpeg' },
              { name: 'Bijan Biswas', photo: 'images/bijan-biswas.jpeg' },
              { name: 'Bijon Kumar Biswas', photo: 'images/bijon-kumar-biswas-delhi.jpeg' },
              { name: 'Dr. Uttam Kumar Biswas', photo: 'images/dr.-uttam-kumar-biswas.jpeg' },
              { name: 'Mr. Somenath Biswas', photo: 'images/mr-somenath-biswas.jpeg' },
              { name: 'Mr. Deepu Sarkar', photo: 'images/mr.-deepu-sarkar.jpeg' },
              { name: 'Mrinal Kanti Biswas', photo: 'images/mrinal-kanti-biswas.jpeg' },
              { name: 'Neuton Roy', photo: 'images/neuton-roy.jpeg' },
              { name: 'Pratap Malik', photo: 'images/pratap-malik.jpeg' },
              { name: 'Pronit Roy', photo: 'images/pronit-roy.jpeg' },
              { name: 'Robin Kumar Ranjit Biswas', photo: 'images/robin-kumar-ranjit-biswas.jpeg' },
              { name: 'Somendra Srivastava', photo: 'images/somendra-srivastava.jpeg' },
              { name: 'Tarak Chandra Pal', photo: 'images/tarak-chandra-pal.jpeg' },
              { name: 'Subhash Kumar', photo: 'images/subhash-kumar.jpeg' },
              { name: 'Sudin Biswas', photo: 'images/sudin-biswas-noida.jpeg' }
            ]).map((member, index) => (
              <motion.div
                key={index}
                className="team-member"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              >
                <img 
                  src={member.photo?.startsWith('http') ? member.photo : member.photo?.startsWith('/uploads') ? `https://sanataningo.onrender.com${member.photo}` : member.photo} 
                  alt={member.name} 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px', objectFit: 'cover' }}
                />
                <h4 style={{ margin: '0.5rem 0', color: '#333' }}>{member.name}</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{member.position || 'Executive Member'}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="content-section" style={{ padding: '80px 0' }}>
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', color: '#ff6b35', marginBottom: '3rem' }}
            >
              Recent Activities
            </motion.h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {galleryImages.slice(0, 6).map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                >
                  <img 
                    src={`https://sanataningo.onrender.com${image.image}`} 
                    alt={image.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1rem', background: 'white' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{image.title}</h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{image.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Events Section */}
      {events.length > 0 && (
        <section className="content-section" style={{ padding: '80px 0', background: '#f8f9fa' }}>
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', color: '#ff6b35', marginBottom: '3rem' }}
            >
              Upcoming Events
            </motion.h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {events.filter(event => event.status === 'upcoming').slice(0, 3).map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{ padding: '2rem', background: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                >
                  <h4 style={{ margin: '0 0 1rem 0', color: '#ff6b35' }}>{event.title}</h4>
                  <p style={{ margin: '0 0 1rem 0', color: '#666' }}>{event.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#999' }}>
                    <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                    <span>📍 {event.venue}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sanatan Dharma Foundation */}
      <section className="dharma-foundation">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Sanatan Dharma – Our Foundation</h2>
            <p>Sanatan Dharma is not just a religion—it is a way of life built on truth, purity, compassion, and eternal wisdom.</p>
            <div className="values-grid">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="value-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <i className={value.icon}></i>
                  <h3>{value.title}</h3>
                  <p>{value.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{ 
        padding: '80px 0', 
        background: 'linear-gradient(135deg, #8B4513, #D2691E)', 
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Join Our Mission</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
              Be part of our spiritual family and help us serve humanity through the eternal values of Sanatan Dharma. 
              Together, we can create positive change in society.
            </p>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/membership" className="btn btn-primary" style={{ 
                background: 'white', 
                color: '#8B4513',
                border: '3px solid white',
                minWidth: '200px'
              }}>
                <i className="fas fa-users"></i> Become a Member
              </Link>
              <Link to="/donate" className="btn btn-secondary" style={{
                background: 'transparent',
                color: 'white',
                border: '3px solid white',
                minWidth: '200px'
              }}>
                <i className="fas fa-heart"></i> Donate Now
              </Link>
              <Link to="/contact" className="btn" style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '3px solid rgba(255,255,255,0.5)',
                minWidth: '200px'
              }}>
                <i className="fas fa-envelope"></i> Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;