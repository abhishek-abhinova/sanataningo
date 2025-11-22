import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
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