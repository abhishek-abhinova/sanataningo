import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { API_BASE_URL } from '../config/api';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/public/team');
      setTeamMembers(response.data.team || []);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTeamMemberImage = (member) => {
    const imageUrl = member.photo || member.photo_url || member.image;
    if (!imageUrl) return '/images/default-avatar.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${API_BASE_URL}${imageUrl}`;
    return `${API_BASE_URL}/${imageUrl}`;
  };

  return (
    <div>
      {/* Page Header */}
      <section className="page-header" style={{ 
        background: 'linear-gradient(135deg, #ff6b35, #f7931e, #d2691e)', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ fontSize: '3rem', marginBottom: '2rem' }}
          >
            <i className="fas fa-om" style={{ color: '#FFD700', marginRight: '15px', fontSize: '3.5rem' }}></i> 
            About Us
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            style={{ textAlign: 'center', margin: '2rem 0' }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#FFE4B5', 
                textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                fontFamily: 'serif',
                letterSpacing: '3px',
                marginBottom: '1.5rem',
                animation: 'glow 2s ease-in-out infinite alternate'
              }}>
                <i className="fas fa-book-open" style={{ marginRight: '15px', color: '#FFD700', fontSize: '2.2rem' }}></i>
                श्रीमद्‍भगवद्‍ गीता
                <i className="fas fa-book-open" style={{ marginLeft: '15px', color: '#FFD700', fontSize: '2.2rem' }}></i>
              </h2>
              <h2 style={{ 
                fontSize: '2.2rem', 
                fontWeight: 'bold', 
                color: '#FFFFFF', 
                textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                fontFamily: 'serif',
                letterSpacing: '2px'
              }}>
                <i className="fas fa-lotus" style={{ marginRight: '15px', color: '#FFE4B5', fontSize: '2rem' }}></i>
                श्री श्री हरि लीलामृत
                <i className="fas fa-lotus" style={{ marginLeft: '15px', color: '#FFE4B5', fontSize: '2rem' }}></i>
              </h2>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{ fontSize: '1.2rem', color: '#FFE4B5', textAlign: 'center' }}
          >
            <i className="fas fa-heart" style={{ marginRight: '10px', color: '#FFD700' }}></i>
            Learn about our mission, vision, and the people behind our organization
            <i className="fas fa-heart" style={{ marginLeft: '10px', color: '#FFD700' }}></i>
          </motion.p>
        </div>
      </section>

      {/* About Content */}
      <section className="content-section" style={{ background: 'linear-gradient(135deg, #fff8f0, #fef6ed)', padding: '80px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{ marginBottom: '3rem' }}
            >
              <h2 style={{ color: '#8b4513', fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-bullseye" style={{ marginRight: '15px', color: '#d2691e' }}></i>
                Our Mission
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderLeft: '5px solid #d2691e' }}>Sarboshakti Sanatani Sangathan is a non-profit, socio-spiritual organization devoted to the service of humanity based on the eternal principles of Sanatan Dharma. We conduct welfare activities, spiritual programs, cultural preservation initiatives, education drives, and community upliftment efforts across the country.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ marginBottom: '3rem' }}
            >
              <h2 style={{ color: '#8b4513', fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-eye" style={{ marginRight: '15px', color: '#d2691e' }}></i>
                Our Vision
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderLeft: '5px solid #d2691e' }}>To create a society rooted in dharmic values where every individual can live with dignity, purpose, and spiritual fulfillment while contributing to the collective welfare of humanity.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 style={{ color: '#8b4513', fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                <i className="fas fa-gem" style={{ marginRight: '15px', color: '#d2691e' }}></i>
                Our Values
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', margin: '2rem 0' }}>
                {[
                  { icon: 'fas fa-om', title: 'Dharma', desc: 'Righteousness and moral duty guide all our actions', color: '#ff6b35' },
                  { icon: 'fas fa-praying-hands', title: 'Seva', desc: 'Selfless service to humanity without expectation', color: '#28a745' },
                  { icon: 'fas fa-sun', title: 'Satya', desc: 'Truth in thought, word, and action', color: '#ffc107' },
                  { icon: 'fas fa-dove', title: 'Karuna', desc: 'Compassion for all living beings', color: '#17a2b8' }
                ].map((value, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    viewport={{ once: true }}
                    style={{ 
                      textAlign: 'center', 
                      padding: '2.5rem 1.5rem', 
                      background: 'linear-gradient(135deg, #ffffff, #f8f9fa)', 
                      borderRadius: '20px', 
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(210, 105, 30, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      right: '-50%',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(45deg, ${value.color}15, transparent)`,
                      borderRadius: '50%'
                    }}></div>
                    <i className={value.icon} style={{ fontSize: '4rem', color: value.color, marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}></i>
                    <h3 style={{ color: '#8b4513', fontSize: '1.5rem', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>{value.title}</h3>
                    <p style={{ color: '#666', lineHeight: '1.6', position: 'relative', zIndex: 2 }}>{value.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trustees Section */}
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
              <h4><i className="fas fa-crown"></i> Trustee</h4>
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
                <img src="images/p2.jpeg" alt="Trustee 2" className="founder-photo" />
              </div>
              <h3>Shri Dinesh Bairagi</h3>
              <h4><i className="fas fa-book-open"></i> Trustee</h4>
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
                <img src="images/p3.jpeg" alt="Trustee 3" className="founder-photo" />
              </div>
              <h3>Shri Shriwas Halder</h3>
              <h4><i className="fas fa-hands-helping"></i> Trustee</h4>
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
                <img src="images/p4.jpeg" alt="Trustee 4" className="founder-photo" />
              </div>
              <h3>Shri Goutam Chandra Biswas</h3>
              <h4><i className="fas fa-seedling"></i> Trustee</h4>
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
            Our Team ({teamMembers.filter(m => m.showInTeam !== false).length + (teamMembers.length === 0 ? 19 : 0)} Members)
          </motion.h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ 
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #d2691e',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ marginTop: '1rem', color: '#666' }}>Loading team members...</p>
            </div>
          ) : (
            <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              {[
                ...teamMembers.filter(member => member.showInTeam !== false),
                ...(teamMembers.length === 0 ? [
                  { name: 'Shri Amiyo Govinda Biswas', photo: '/images/amiyo-govinda-biswas.jpeg' },
                  { name: 'Shri Pratap Malik', photo: '/images/pratap-malik.jpeg' },
                  { name: 'Shri Tarak Chandra Pal', photo: '/images/tarak-chandra-pal.jpeg' },
                  { name: 'Dr. Uttam Kumar Biswas', photo: '/images/dr.-uttam-kumar-biswas.jpeg' },
                  { name: 'Shri Bijan Biswas', photo: '/images/bijan-biswas.jpeg' },
                  { name: 'Shri Arun Kumar Biswas', photo: '/images/arun-kumar-biswas.jpeg' },
                  { name: 'Shri Sudin Biswas', photo: '/images/sudin-biswas-noida.jpeg' },
                  { name: 'Shri Aleep Biswas', photo: '/images/aleep-biswas.jpeg' },
                  { name: 'Shri Shyamlal Chaudhary', photo: '/images/Shyamlalchaudhary.jpeg' },
                  { name: 'Dr. Shyama Shree Chaki', photo: 'images/drshyamasreechaki.jpeg' },
                  { name: 'Shri Pronit Roy', photo: '/images/pronit-roy.jpeg' },
                  { name: 'Shri Mrinal Biswas', photo: '/images/mrinal-kanti-biswas.jpeg' },
                  { name: 'Shri Deepu Sarkar', photo: '/images/mr.-deepu-sarkar.jpeg' },
                  { name: 'Shri Neuton Roy', photo: '/images/neuton-roy.jpeg' },
                  { name: 'Shri Somenath Biswas', photo: '/images/mr-somenath-biswas.jpeg' },
                  { name: 'Shri Bijon Kumar Biswas', photo: '/images/bijon-kumar-biswas-delhi.jpeg' },
                  { name: 'Shri Subash Biswas Somendra', photo: '/images/subhash-kumar.jpeg' },
                  { name: 'Shri Somendra Srivastava', photo: '/images/somendra-srivastava.jpeg' },
                  { name: 'Robin Kumar Ranjit Biswas', photo: 'images/robin-kumar-ranjit-biswas.jpeg' }
                ] : [])
              ].map((member, index) => (
                <motion.div
                  key={member._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                    borderRadius: '15px',
                    padding: '2rem',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(210, 105, 30, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #ff6b35, #d2691e)'
                  }}></div>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    margin: '0 auto 1.5rem',
                    overflow: 'hidden',
                    border: '3px solid #d2691e',
                    boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)'
                  }}>
                    <img 
                      src={getTeamMemberImage(member) || '/images/default-avatar.png'} 
                      alt={member.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #ff6b35, #d2691e)',
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      color: 'white'
                    }}>
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <h4 style={{ color: '#8b4513', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{member.name}</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-users" style={{ marginRight: '8px', color: '#d2691e' }}></i>
                    {member.position || member.designation || 'Team Member'}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          0% { text-shadow: 3px 3px 6px rgba(0,0,0,0.3); }
          100% { text-shadow: 3px 3px 6px rgba(0,0,0,0.3), 0 0 20px rgba(255, 228, 181, 0.5); }
        }
      `}</style>
    </div>
  );
};

export default About;