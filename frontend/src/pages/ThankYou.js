import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const [details, setDetails] = useState({});

  useEffect(() => {
    const type = searchParams.get('type');
    const name = searchParams.get('name');
    const amount = searchParams.get('amount');
    const id = searchParams.get('donationId') || searchParams.get('memberId');

    setDetails({ type, name, amount, id });
  }, [searchParams]);

  const isDonation = details.type === 'donation';
  const isMembership = details.type === 'membership';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', paddingTop: '90px' }}>
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
          >
            🙏
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ color: '#28a745', marginBottom: '1rem', fontSize: '2.5rem' }}
          >
            Thank You!
          </motion.h1>

          {isDonation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>Your Donation Has Been Submitted</h2>
              <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Dear {details.name}, thank you for your generous donation of <strong>₹{details.amount}</strong>. 
                Your contribution will help us continue our mission of serving humanity through Sanatan Dharma values.
              </p>
              <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
                <p style={{ margin: 0, color: '#495057' }}>
                  <strong>Donation ID:</strong> {details.id}<br/>
                  Your donation is being verified. You will receive a receipt via email once approved.
                </p>
              </div>
            </motion.div>
          )}

          {isMembership && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>Welcome to Our Family!</h2>
              <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                Dear {details.name}, thank you for becoming a member of Sarboshakti Sanatani Sangathan. 
                Your membership application has been submitted successfully.
              </p>
              <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
                <p style={{ margin: 0, color: '#495057' }}>
                  <strong>Member ID:</strong> {details.id}<br/>
                  Your membership is being processed. You will receive confirmation and digital membership card via email once approved.
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ marginTop: '2rem' }}
          >
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/" 
                className="btn btn-primary"
                style={{ minWidth: '150px' }}
              >
                <i className="fas fa-home"></i> Go Home
              </Link>
              <Link 
                to="/contact" 
                className="btn btn-secondary"
                style={{ minWidth: '150px' }}
              >
                <i className="fas fa-envelope"></i> Contact Us
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ marginTop: '2rem', padding: '1rem', background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)', borderRadius: '10px' }}
          >
            <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
              <strong>🕉️ Dharma • Seva • Sanskriti • Samaj 🕉️</strong><br/>
              Together, we serve humanity through eternal values
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYou;