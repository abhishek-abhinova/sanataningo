import React from 'react';
import { motion } from 'framer-motion';

const DonationReceipt = ({ donation }) => {
  const currentDate = new Date().toLocaleDateString('en-IN');
  const receiptNo = `SSS-${Date.now()}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '2px solid #d2691e'
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #8b4513, #d2691e)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 'bold' }}>
          🕉️ SARBO SHAKTI SONATANI SANGATHAN
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
          19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, UP-231301
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
          Email: info@sarboshaktisonatanisangathan.org | Phone: +91 9876543210
        </p>
      </div>

      {/* Receipt Title */}
      <div style={{
        background: 'linear-gradient(135deg, #fff8f0, #fef6ed)',
        padding: '1.5rem',
        textAlign: 'center',
        borderBottom: '2px solid #d2691e'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: '#8b4513', 
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🧾 DONATION RECEIPT
        </h2>
      </div>

      {/* Receipt Details */}
      <div style={{ padding: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1.5rem',
          background: '#f8f9fa',
          borderRadius: '10px',
          border: '1px solid #e9ecef'
        }}>
          <div>
            <strong style={{ color: '#8b4513' }}>Receipt No:</strong>
            <div style={{ color: '#d2691e', fontWeight: 'bold' }}>{receiptNo}</div>
          </div>
          <div>
            <strong style={{ color: '#8b4513' }}>Date:</strong>
            <div>{currentDate}</div>
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          border: '1px solid #28a745'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#28a745', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-user" style={{ marginRight: '10px' }}></i>
            Donor Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <strong>Name:</strong> {donation?.donorName || 'N/A'}
            </div>
            <div>
              <strong>Phone:</strong> {donation?.phone || 'N/A'}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Email:</strong> {donation?.email || 'N/A'}
            </div>
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          border: '1px solid #ffc107'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#856404', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-rupee-sign" style={{ marginRight: '10px' }}></i>
            Donation Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <strong>Amount:</strong> 
              <div style={{ fontSize: '1.5rem', color: '#28a745', fontWeight: 'bold' }}>
                ₹{donation?.amount || '0'}
              </div>
            </div>
            <div>
              <strong>Purpose:</strong> {donation?.purpose || 'General Donation'}
            </div>
            <div>
              <strong>Payment Method:</strong> UPI Transfer
            </div>
            <div>
              <strong>Transaction ID:</strong> {donation?.paymentReference || 'N/A'}
            </div>
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #d1ecf1, #bee5eb)',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          border: '1px solid #17a2b8'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0c5460', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-file-invoice-dollar" style={{ marginRight: '10px' }}></i>
            Tax Benefit Information
          </h3>
          <p style={{ margin: 0, color: '#0c5460', lineHeight: '1.6' }}>
            This donation is eligible for <strong>tax exemption under Section 80G</strong> of the Income Tax Act. 
            Please retain this receipt for your tax filing purposes.
          </p>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
          borderRadius: '10px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#8b4513', fontSize: '1.3rem' }}>
            🙏 Thank You for Your Noble Contribution! 🙏
          </h3>
          <p style={{ margin: 0, color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Your generous donation enables us to continue our mission of serving society through dharmic values, 
            cultural preservation, and community welfare programs.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#8b4513',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        fontSize: '0.85rem'
      }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          This receipt is computer generated and does not require signature.
        </p>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          For any queries, please contact us at info@sarboshaktisonatanisangathan.org
        </p>
        <p style={{ margin: 0, fontStyle: 'italic', color: '#FFE4B5' }}>
          "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः" - May all beings be happy and healthy
        </p>
      </div>
    </motion.div>
  );
};

export default DonationReceipt;