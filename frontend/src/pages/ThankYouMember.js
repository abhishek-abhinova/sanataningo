import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const ThankYouMember = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const memberData = location.state?.memberData;
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
    }
  }, [countdown, navigate]);

  return (
    <div style={{ marginTop: '90px', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          
          <h1 style={{ color: '#6f42c1', marginBottom: '1rem', fontSize: '2.5rem' }}>Welcome to Our Family!</h1>
          
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
            Your membership application has been submitted successfully.
          </p>

          {memberData && (
            <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '15px', marginBottom: '2rem', textAlign: 'left' }}>
              <h3 style={{ color: '#6f42c1', marginBottom: '1rem', textAlign: 'center' }}>👤 Membership Details</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div><strong>Name:</strong> {memberData.fullName}</div>
                <div><strong>Email:</strong> {memberData.email}</div>
                <div><strong>Phone:</strong> {memberData.phone}</div>
                <div><strong>Membership:</strong> <span style={{ color: '#6f42c1', fontWeight: 'bold' }}>{memberData.membershipPlan}</span></div>
                <div><strong>Amount:</strong> <span style={{ color: '#28a745', fontSize: '1.2rem', fontWeight: 'bold' }}>₹{memberData.amount}</span></div>
                <div><strong>UPI Reference:</strong> {memberData.upiReference}</div>
                <div><strong>Member ID:</strong> {memberData.memberId}</div>
              </div>
            </div>
          )}

          <div style={{ background: '#e7e3ff', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
            <h4 style={{ color: '#5a2d82', marginBottom: '0.5rem' }}>✅ What happens next?</h4>
            <ul style={{ textAlign: 'left', color: '#5a2d82', margin: 0, paddingLeft: '1.5rem' }}>
              <li><strong>Wait for 24 hours</strong> - Our team will verify your payment</li>
              <li><strong>Membership approval</strong> - Admin will review and approve your membership</li>
              <li><strong>Confirmation email</strong> - You'll receive a confirmation email with your membership details</li>
              <li><strong>Digital membership card</strong> will be sent to your email</li>
              <li><strong>Access to all member benefits</strong> and programs</li>
            </ul>
          </div>

          <div style={{ background: '#fff3cd', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem', textAlign: 'center' }}>
            <h4 style={{ color: '#856404', marginBottom: '0.5rem' }}>⏰ Auto Redirect</h4>
            <p style={{ color: '#856404', margin: 0, fontSize: '1.1rem' }}>
              Redirecting to home page in <strong>{countdown} seconds</strong>
            </p>
          </div>

          <div style={{ background: '#fff3cd', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
            <h4 style={{ color: '#856404', marginBottom: '0.5rem' }}>🎫 Membership Benefits</h4>
            <ul style={{ textAlign: 'left', color: '#856404', margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
              <li>Participation in all cultural and spiritual programs</li>
              <li>Access to educational workshops and seminars</li>
              <li>Community service opportunities</li>
              <li>Networking with like-minded individuals</li>
              <li>Digital membership card and certificate</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#666', fontSize: '1.1rem', fontStyle: 'italic' }}>
              "Together we serve humanity through the eternal values of Sanatan Dharma"
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ 
              background: 'linear-gradient(135deg, #6f42c1, #e83e8c)', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '25px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}>
              🏠 Back to Home
            </Link>
            <Link to="/about" style={{ 
              background: 'linear-gradient(135deg, #007bff, #6610f2)', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '25px', 
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}>
              📖 Learn More
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

export default ThankYouMember;
