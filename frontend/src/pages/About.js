import React from 'react';
import { motion } from 'framer-motion';

const About = () => {


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

      {/* Team Members Section */}
      <section className="content-section" style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', color: '#ff6b35', marginBottom: '3rem' }}
          >
            Our Team (21 Members)
          </motion.h2>
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Aleep Biswas', image: 'images/aleep-biswas.jpeg' },
              { name: 'Amiyo Govinda Biswas', image: 'images/amiyo-govinda-biswas.jpeg' },
              { name: 'Arun Kumar Biswas', image: 'images/arun-kumar-biswas.jpeg' },
              { name: 'Bijan Biswas', image: 'images/bijan-biswas.jpeg' },
              { name: 'Bijon Kumar Biswas', image: 'images/bijon-kumar-biswas-delhi.jpeg' },
              { name: 'Dr. Uttam Kumar Biswas', image: 'images/dr.-uttam-kumar-biswas.jpeg' },
              { name: 'Mr. Somenath Biswas', image: 'images/mr-somenath-biswas.jpeg' },
              { name: 'Mr. Deepu Sarkar', image: 'images/mr.-deepu-sarkar.jpeg' },
              { name: 'Mrinal Kanti Biswas', image: 'images/mrinal-kanti-biswas.jpeg' },
              { name: 'Neuton Roy', image: 'images/neuton-roy.jpeg' },
              { name: 'Pratap Malik', image: 'images/pratap-malik.jpeg' },
              { name: 'Pronit Roy', image: 'images/pronit-roy.jpeg' },
              { name: 'Robin Kumar Ranjit Biswas', image: 'images/robin-kumar-ranjit-biswas.jpeg' },
              { name: 'Somendra Srivastava', image: 'images/somendra-srivastava.jpeg' },
              { name: 'Tarak Chandra Pal', image: 'images/tarak-chandra-pal.jpeg' },
              { name: 'Subhash Kumar', image: 'images/subhash-kumar.jpeg' },
              { name: 'Sudin Biswas', image: 'images/sudin-biswas-noida.jpeg' }
            ].map((member, index) => (
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
                  src={member.image} 
                  alt={`Executive Member ${index + 1}`} 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px', objectFit: 'cover' }}
                />
                <h4 style={{ margin: '0.5rem 0', color: '#333' }}>{member.name}</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Executive Member</p>
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