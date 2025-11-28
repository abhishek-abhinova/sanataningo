import React, { useState } from 'react';
import api from '../utils/api';

const EmailTest = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testDonationEmail = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/test/test-donation-email');
      setMessage('✅ ' + response.data.message);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.error || 'Failed to send email'));
    } finally {
      setLoading(false);
    }
  };

  const testMembershipEmail = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/test/test-membership-email');
      setMessage('✅ ' + response.data.message);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.error || 'Failed to send email'));
    } finally {
      setLoading(false);
    }
  };

  const testSimpleThankYou = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/test/test-simple-thank-you');
      setMessage('✅ ' + response.data.message);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.error || 'Failed to send email'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-envelope"></i> Email Service Test</h1>
          <p><i className="fas fa-star-of-david"></i> Test email functionality <i className="fas fa-star-of-david"></i></p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ textAlign: 'center', color: '#8b4513', marginBottom: '2rem' }}>
              Email Service Testing
            </h2>
            
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Test emails will be sent to: <strong>abhisheks200426@gmail.com</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button
                onClick={testDonationEmail}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #28a745, #20c997)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '200px'
                }}
              >
                {loading ? 'Sending...' : '📧 Test Donation Email'}
              </button>

              <button
                onClick={testMembershipEmail}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #6f42c1, #e83e8c)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '200px'
                }}
              >
                {loading ? 'Sending...' : '🎫 Test Membership Email'}
              </button>

              <button
                onClick={testSimpleThankYou}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #ff6b35, #f7931e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '200px'
                }}
              >
                {loading ? 'Sending...' : '🙏 Simple Thank You'}
              </button>
            </div>

            {message && (
              <div style={{
                padding: '15px',
                borderRadius: '10px',
                textAlign: 'center',
                background: message.includes('✅') ? '#d4edda' : '#f8d7da',
                color: message.includes('✅') ? '#155724' : '#721c24',
                border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                {message}
              </div>
            )}

            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ color: '#495057', marginBottom: '0.5rem' }}>What to expect:</h4>
              <ul style={{ color: '#6c757d', margin: 0, paddingLeft: '1.5rem' }}>
                <li><strong>Donation Email:</strong> Thank you email with donation receipt</li>
                <li><strong>Membership Email:</strong> Welcome email with PDF membership card</li>
                <li><strong>Simple Thank You:</strong> Basic thank you email (for debugging)</li>
                <li><strong>Check:</strong> Your inbox and spam folder</li>
                <li><strong>Time:</strong> Emails should arrive within 1-2 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmailTest;