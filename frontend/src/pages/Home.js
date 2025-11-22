import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop'
  ];

  const founders = [
    {
      name: 'Dr. Uttam Kumar Biswas',
      position: 'President',
      image: '/images/dr.-uttam-kumar-biswas.jpeg',
      description: 'A devoted follower of Sanatan Sanskriti committed to serving society through dharma, awareness, and compassion. Leading the organization with spiritual wisdom and social vision.'
    },
    {
      name: 'Shri Amiyo Govinda Biswas',
      position: 'Vice President',
      image: '/images/amiyo-govinda-biswas.jpeg',
      description: 'A spiritual thinker and scholar guiding the Sangathan\'s cultural preservation and Sanatan awareness programs with deep knowledge of ancient scriptures.'
    },
    {
      name: 'Shri Bijon Kumar Biswas',
      position: 'Secretary',
      image: '/images/bijon-kumar-biswas-delhi.jpeg',
      description: 'Dedicated to executing social welfare activities, charity drives, and community upliftment programs with hands-on approach to serving the needy.'
    },
    {
      name: 'Shri Mrinal Kanti Biswas',
      position: 'Treasurer',
      image: '/images/mrinal-kanti-biswas.jpeg',
      description: 'Works closely with the next generation to promote dharmic values, leadership development, and moral responsibility among youth and students.'
    }
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

    return () => clearInterval(interval);
  }, [slides.length]);

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
Our Trustees
          </motion.h2>
          <div className="founders-grid">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                className="founder-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="founder-image">
                  <img src={founder.image} alt={founder.name} className="founder-photo" />
                </div>
                <h3>{founder.name}</h3>
                <h4><i className="fas fa-crown"></i> {founder.position}</h4>
                <p>{founder.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Team Section */}
      <section className="executive-team" style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            Our Executive Team
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Shri Aleep Biswas', position: 'Executive Member', image: '/images/aleep-biswas.jpeg' },
              { name: 'Shri Arun Kumar Biswas', position: 'Executive Member', image: '/images/arun-kumar-biswas.jpeg' },
              { name: 'Shri Bijan Biswas', position: 'Executive Member', image: '/images/bijan-biswas.jpeg' },
              { name: 'Shri Somenath Biswas', position: 'Executive Member', image: '/images/mr-somenath-biswas.jpeg' },
              { name: 'Shri Deepu Sarkar', position: 'Executive Member', image: '/images/mr.-deepu-sarkar.jpeg' },
              { name: 'Shri Neuton Roy', position: 'Executive Member', image: '/images/neuton-roy.jpeg' },
              { name: 'Shri Pratap Malik', position: 'Executive Member', image: '/images/pratap-malik.jpeg' },
              { name: 'Shri Pronit Roy', position: 'Executive Member', image: '/images/pronit-roy.jpeg' },
              { name: 'Shri Robin Kumar Ranjit Biswas', position: 'Executive Member', image: '/images/robin-kumar-ranjit-biswas.jpeg' },
              { name: 'Shri Somendra Srivastava', position: 'Executive Member', image: '/images/somendra-srivastava.jpeg' },
              { name: 'Shri Subhash Kumar', position: 'Executive Member', image: '/images/subhash-kumar.jpeg' },
              { name: 'Shri Sudin Biswas', position: 'Executive Member', image: '/images/sudin-biswas-noida.jpeg' },
              { name: 'Shri Tarak Chandra Pal', position: 'Executive Member', image: '/images/tarak-chandra-pal.jpeg' },
              { name: 'Executive Member 14', position: 'Executive Member', image: '/images/photo1.jpeg' },
              { name: 'Executive Member 15', position: 'Executive Member', image: '/images/photo2.jpeg' },
              { name: 'Executive Member 16', position: 'Executive Member', image: '/images/photo3.jpeg' },
              { name: 'Executive Member 17', position: 'Executive Member', image: '/images/photo4.jpeg' }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '15px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}
              >
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', border: '3px solid #d2691e' }}>
                  <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>{member.name}</h4>
                <p style={{ color: '#d2691e', fontWeight: 'bold', margin: 0 }}>{member.position}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Our Impact Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #FFFBF0, #FFF8E7)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <h2 style={{ color: '#8B4513', marginBottom: '3rem' }}>Our Impact & Services</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[
                {
                  icon: '📚',
                  title: 'Educational Programs',
                  description: 'Providing quality education and scholarships to underprivileged children, promoting literacy and knowledge sharing.',
                  impact: '500+ Students Supported'
                },
                {
                  icon: '🏥',
                  title: 'Healthcare Services',
                  description: 'Free medical camps, health awareness programs, and support for medical treatments in rural areas.',
                  impact: '1000+ Patients Treated'
                },
                {
                  icon: '🎭',
                  title: 'Cultural Preservation',
                  description: 'Organizing cultural events, preserving traditional arts, and promoting Sanatan values among youth.',
                  impact: '50+ Cultural Events'
                },
                {
                  icon: '🤝',
                  title: 'Community Development',
                  description: 'Empowering communities through skill development, women empowerment, and rural development programs.',
                  impact: '25+ Villages Reached'
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(139, 69, 19, 0.15)',
                    border: '1px solid #FFD700',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{service.icon}</div>
                  <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>{service.title}</h3>
                  <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>{service.description}</p>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #d2691e, #ff8c00)', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '20px', 
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {service.impact}
                  </div>
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