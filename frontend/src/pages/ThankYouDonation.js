import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const ThankYouDonation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const donationData = location.state?.donationData;
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={{ marginTop: '90px', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🙏</div>
          
          <h1 style={{ color: '#28a745', marginBottom: '1rem', fontSize: '2.5rem' }}>Thank You!</h1>
          
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
            Your generous donation has been received and is being processed.
          </p>

          {donationData && (
            <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '15px', marginBottom: '2rem', textAlign: 'left' }}>
              <h3 style={{ color: '#28a745', marginBottom: '1rem', textAlign: 'center' }}>📋 Donation Details</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div><strong>Donor:</strong> {donationData.donorName}</div>
                <div><strong>Amount:</strong> <span style={{ color: '#28a745', fontSize: '1.2rem', fontWeight: 'bold' }}>₹{donationData.amount}</span></div>
                <div><strong>Purpose:</strong> {donationData.purpose}</div>
                <div><strong>UPI Reference:</strong> {donationData.paymentReference}</div>
                <div><strong>Donation ID:</strong> {donationData.donationId}</div>
              </div>
            </div>
          )}

          <div style={{ background: '#e8f5e8', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
            <h4 style={{ color: '#155724', marginBottom: '0.5rem' }}>✅ What happens next?</h4>
            <ul style={{ textAlign: 'left', color: '#155724', margin: 0, paddingLeft: '1.5rem' }}>
              <li><strong>Wait for 24 hours</strong> - Our team will verify your payment</li>
              <li><strong>Email receipt automatically</strong> - You'll receive donation receipt in your email</li>
              <li><strong>Tax exemption certificate (80G)</strong> will be included</li>
              <li><strong>Thank you email</strong> with impact details</li>
            </ul>
          </div>

          <div style={{ background: '#fff3cd', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem', textAlign: 'center' }}>
            <h4 style={{ color: '#856404', marginBottom: '0.5rem' }}>⏰ Auto Redirect</h4>
            <p style={{ color: '#856404', margin: 0, fontSize: '1.1rem' }}>
              Redirecting to home page in <strong>{countdown} seconds</strong>
            </p>
          </div>

          <div style={{ background: '#fff3cd', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
            <h4 style={{ color: '#856404', marginBottom: '0.5rem' }}>💰 Tax Benefits</h4>
            <p style={{ color: '#856404', margin: 0, fontSize: '0.9rem' }}>
              Your donation is eligible for tax deduction under Section 80G of the Income Tax Act. 
              Please retain the receipt for your tax filing.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#666', fontSize: '1.1rem', fontStyle: 'italic' }}>
              "Your generosity helps us serve humanity through Sanatan Dharma values"
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ 
              background: 'linear-gradient(135deg, #28a745, #20c997)', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '25px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}>
              🏠 Back to Home
            </Link>
            <Link to="/donate" style={{ 
              background: 'linear-gradient(135deg, #007bff, #6610f2)', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '25px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}>
              💝 Donate Again
            </Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '10px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              🕉️ <strong>Dharma • Seva • Sanskriti • Samaj</strong> 🕉️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouDonation;