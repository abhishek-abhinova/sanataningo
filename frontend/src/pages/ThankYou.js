import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DonationReceipt from '../components/DonationReceipt';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [details, setDetails] = useState({});
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    const name = searchParams.get('name');
    const amount = searchParams.get('amount');
    const id = searchParams.get('donationId') || searchParams.get('memberId');
    
    // Get data from location state if available
    const stateData = location.state?.donationData || location.state?.memberData;
    
    setDetails({ 
      type, 
      name: name || stateData?.donorName || stateData?.fullName, 
      amount: amount || stateData?.amount, 
      id: id || stateData?.donationId || stateData?.memberId,
      ...stateData
    });
  }, [searchParams, location.state]);

  const isDonation = details.type === 'donation';
  const isMembership = details.type === 'membership';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff8f0, #fef6ed, #f8f9fa)', 
      paddingTop: '90px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        fontSize: '8rem',
        color: 'rgba(210, 105, 30, 0.05)',
        animation: 'float 6s ease-in-out infinite'
      }}>🕉️</div>
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        fontSize: '6rem',
        color: 'rgba(255, 107, 53, 0.05)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}>🙏</div>
      
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ 
            maxWidth: '700px', 
            margin: '0 auto', 
            background: 'linear-gradient(135deg, #ffffff, #f8f9fa)', 
            padding: '3rem', 
            borderRadius: '25px', 
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            border: '2px solid rgba(210, 105, 30, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, rgba(255, 107, 53, 0.1), transparent)',
            borderRadius: '50%'
          }}></div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ 
              fontSize: '5rem', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #ff6b35, #d2691e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
            }}
          >
            🙏
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ 
              background: 'linear-gradient(135deg, #28a745, #20c997)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem', 
              fontSize: '3rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            धन्यवाद! Thank You!
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
              <div style={{ 
                background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)', 
                padding: '2rem', 
                borderRadius: '15px', 
                marginBottom: '2rem',
                border: '2px solid #28a745',
                boxShadow: '0 8px 20px rgba(40, 167, 69, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <i className="fas fa-receipt" style={{ fontSize: '2rem', color: '#28a745', marginRight: '10px' }}></i>
                  <h3 style={{ margin: 0, color: '#28a745' }}>Donation Summary</h3>
                </div>
                <p style={{ margin: '0 0 1rem 0', color: '#155724', fontSize: '1.1rem' }}>
                  <strong>Donation ID:</strong> {details.id}<br/>
                  <strong>Amount:</strong> ₹{details.amount}<br/>
                  <strong>Purpose:</strong> {details.purpose || 'General Donation'}
                </p>
                <p style={{ margin: 0, color: '#155724', fontSize: '0.95rem' }}>
                  Your donation is being verified. You will receive a detailed receipt via email once approved.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReceipt(!showReceipt)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.8rem 1.5rem',
                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                  }}
                >
                  <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                  {showReceipt ? 'Hide Receipt' : 'View Receipt'}
                </motion.button>
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
              <div style={{ 
                background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)', 
                padding: '2rem', 
                borderRadius: '15px', 
                marginBottom: '2rem',
                border: '2px solid #ffc107',
                boxShadow: '0 8px 20px rgba(255, 193, 7, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <i className="fas fa-id-card" style={{ fontSize: '2rem', color: '#856404', marginRight: '10px' }}></i>
                  <h3 style={{ margin: 0, color: '#856404' }}>Membership Summary</h3>
                </div>
                <p style={{ margin: '0 0 1rem 0', color: '#856404', fontSize: '1.1rem' }}>
                  <strong>Member ID:</strong> {details.id}<br/>
                  <strong>Membership Type:</strong> {details.membershipPlan}<br/>
                  <strong>Amount Paid:</strong> ₹{details.amount}
                </p>
                <p style={{ margin: 0, color: '#856404', fontSize: '0.95rem' }}>
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
            style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, #d2691e, #ff6b35)', 
              borderRadius: '15px',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
              🕉️ Dharma • Seva • Sanskriti • Samaj 🕉️
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>
              Together, we serve humanity through eternal values
            </p>
          </motion.div>
        </motion.div>
        
        {/* Show receipt if donation and button clicked */}
        {isDonation && showReceipt && (
          <DonationReceipt donation={details} />
        )}
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default ThankYou;