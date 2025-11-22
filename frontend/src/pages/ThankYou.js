import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ThankYou = () => {
  return (
    <div>
      {/* Thank You Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
        marginTop: '80px'
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 200 }}
              style={{
                width: '120px',
                height: '120px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <i className="fas fa-check" style={{ fontSize: '3rem', color: '#4ade80' }}></i>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800' }}
            >
              Thank You!
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: '400', opacity: 0.9 }}
            >
              Your contribution has been received successfully
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                borderRadius: '20px',
                marginBottom: '2rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                We are deeply grateful for your support. Your contribution will help us continue our mission of serving humanity through the principles of Sanatan Dharma.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <i className="fas fa-envelope" style={{ fontSize: '2rem', color: '#ffd700', marginBottom: '0.5rem' }}></i>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Receipt sent to your email</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <i className="fas fa-shield-alt" style={{ fontSize: '2rem', color: '#4ade80', marginBottom: '0.5rem' }}></i>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Secure transaction</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <i className="fas fa-certificate" style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }}></i>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Tax benefits available</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link 
                to="/" 
                className="btn btn-primary"
                style={{ 
                  padding: '1rem 2rem', 
                  fontSize: '1.1rem', 
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid white',
                  color: 'white',
                  borderRadius: '50px',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-home"></i> Back to Home
              </Link>
              
              <Link 
                to="/activities" 
                className="btn btn-secondary"
                style={{ 
                  padding: '1rem 2rem', 
                  fontSize: '1.1rem', 
                  textDecoration: 'none',
                  background: 'white',
                  color: '#667eea',
                  borderRadius: '50px',
                  transition: 'all 0.3s ease',
                  border: 'none'
                }}
              >
                <i className="fas fa-eye"></i> View Our Work
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              style={{ marginTop: '3rem', fontSize: '0.9rem', opacity: 0.7 }}
            >
              <p>🙏 May you be blessed with prosperity and happiness</p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Sarboshakti Sanatani Sangathan</strong><br />
                Serving Humanity through Sanatan Dharma
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #FFFBF0, #FFF8E7)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <h2 style={{ color: '#8B4513', marginBottom: '2rem' }}>What Happens Next?</h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '2rem', 
              marginTop: '3rem' 
            }}>
              {[
                {
                  step: '1',
                  title: 'Email Confirmation',
                  description: 'You will receive a confirmation email with your receipt and transaction details.',
                  icon: 'fas fa-envelope-open'
                },
                {
                  step: '2',
                  title: 'Tax Receipt',
                  description: 'An official tax receipt will be sent for claiming 80G tax benefits.',
                  icon: 'fas fa-file-invoice'
                },
                {
                  step: '3',
                  title: 'Updates',
                  description: 'Stay connected with us to receive updates about our programs and activities.',
                  icon: 'fas fa-bell'
                },
                {
                  step: '4',
                  title: 'Join Community',
                  description: 'Consider becoming a member to actively participate in our mission.',
                  icon: 'fas fa-users'
                }
              ].map((item, index) => (
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
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(139, 69, 19, 0.15)',
                    border: '1px solid #FFD700',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '20px',
                    width: '30px',
                    height: '30px',
                    background: 'linear-gradient(135deg, #d2691e, #ff8c00)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {item.step}
                  </div>
                  
                  <i className={item.icon} style={{ fontSize: '2.5rem', color: '#d2691e', marginBottom: '1rem' }}></i>
                  <h3 style={{ color: '#333', marginBottom: '1rem' }}>{item.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ThankYou;