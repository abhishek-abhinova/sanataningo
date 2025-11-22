import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const founders = [
    {
      name: 'Shri Ajit Ray',
      position: 'Founder',
      image: '/images/p1.jpeg',
      description: 'A devoted follower of Sanatan Sanskriti committed to serving society through dharma, awareness, and compassion. Leading the organization with spiritual wisdom and social vision.'
    },
    {
      name: 'Shri Dinesh Bairagi',
      position: 'Founder',
      image: '/images/p2.jpeg',
      description: 'A spiritual thinker and scholar guiding the Sangathan\'s cultural preservation and Sanatan awareness programs with deep knowledge of ancient scriptures.'
    },
    {
      name: 'Shri Shreebash Halder',
      position: 'Founder',
      image: '/images/p3.jpeg',
      description: 'Dedicated to executing social welfare activities, charity drives, and community upliftment programs with hands-on approach to serving the needy.'
    },
    {
      name: 'Shri Goutam Chandra Biswas',
      position: 'Founder',
      image: '/images/p4.jpeg',
      description: 'Works closely with the next generation to promote dharmic values, leadership development, and moral responsibility among youth and students.'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-info-circle"></i> About Us</h1>
          <p>Learn about our mission, vision, and the people behind our organization</p>
        </div>
      </section>

      {/* About Content */}
      <section className="content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Our Mission</h2>
            <p>Sarboshakti Sanatani Sangathan is a non-profit, socio-spiritual organization devoted to the service of humanity based on the eternal principles of Sanatan Dharma. We conduct welfare activities, spiritual programs, cultural preservation initiatives, education drives, and community upliftment efforts across the country.</p>
            
            <h2>Our Vision</h2>
            <p>To create a society rooted in dharmic values where every individual can live with dignity, purpose, and spiritual fulfillment while contributing to the collective welfare of humanity.</p>
            
            <h2>Our Values</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', margin: '2rem 0' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <i className="fas fa-om" style={{ fontSize: '3rem', color: '#d2691e', marginBottom: '1rem' }}></i>
                <h3>Dharma</h3>
                <p>Righteousness and moral duty guide all our actions</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <i className="fas fa-praying-hands" style={{ fontSize: '3rem', color: '#d2691e', marginBottom: '1rem' }}></i>
                <h3>Seva</h3>
                <p>Selfless service to humanity without expectation</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <i className="fas fa-sun" style={{ fontSize: '3rem', color: '#d2691e', marginBottom: '1rem' }}></i>
                <h3>Satya</h3>
                <p>Truth in thought, word, and action</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <i className="fas fa-dove" style={{ fontSize: '3rem', color: '#d2691e', marginBottom: '1rem' }}></i>
                <h3>Karuna</h3>
                <p>Compassion for all living beings</p>
              </div>
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

      {/* History Section */}
      <section className="content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Our History</h2>
            <p>Founded with the noble intention of preserving and promoting Sanatan Dharma values, Sarboshakti Sanatani Sangathan has been serving society for over a decade. Our journey began with a small group of dedicated individuals who shared a common vision of creating positive change in society through spiritual and social service.</p>
            
            <p>Over the years, we have grown into a respected organization with thousands of members across the country, all united by the common goal of serving humanity and upholding dharmic principles. Our work spans across various domains including education, healthcare, disaster relief, cultural preservation, and spiritual guidance.</p>
            
            <h2>Our Achievements</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', margin: '2rem 0' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d2691e' }}>1200+</div>
                <div>Active Members</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d2691e' }}>75+</div>
                <div>Programs Conducted</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d2691e' }}>12+</div>
                <div>Years of Service</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d2691e' }}>50+</div>
                <div>Cities Reached</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;