import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const Donate = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const navigate = useNavigate();

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const selectAmount = (amount) => {
    setSelectedAmount(amount);
    setValue('amount', amount);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    // Show thank you page immediately
    const donationData = {
      donorName: data.donorName,
      amount: data.amount,
      purpose: data.purpose || 'general',
      paymentReference: data.upiReference,
      donationId: 'Processing...'
    };
    
    navigate('/thank-you-donation', { 
      state: { donationData } 
    });
    
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'paymentScreenshot') {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });
      
      const response = await fetch(API_ENDPOINTS.DONATIONS, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit donation');
      }
      
      const result = await response.json();
      console.log('Donation submitted successfully:', result);
      
      reset();
      setSelectedAmount('');
    } catch (error) {
      console.error('Donation submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-heart"></i> Make a Donation</h1>
          <p>Support our mission to serve humanity through Sanatan Dharma</p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="content-section">
        <div className="container">
          <div className="form-container">
            <h2>Donation Form</h2>
            <p>Your generous contribution helps us continue our service to society</p>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="donorName">Full Name *</label>
                <input
                  type="text"
                  id="donorName"
                  autoComplete="name"
                  {...register('donorName', { required: 'Full name is required' })}
                />
                {errors.donorName && <span className="error">{errors.donorName.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && <span className="error">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  autoComplete="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                />
                {errors.phone && <span className="error">{errors.phone.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  autoComplete="street-address"
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && <span className="error">{errors.address.message}</span>}
              </div>

              <div className="form-group">
                <label>Select Donation Amount *</label>
                <div className="donation-amounts">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`amount-btn ${selectedAmount === amount ? 'active' : ''}`}
                      onClick={() => selectAmount(amount)}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Custom Amount (₹) *</label>
                <input
                  type="number"
                  id="amount"
                  min="1"
                  {...register('amount', { 
                    required: 'Amount is required',
                    min: {
                      value: 1,
                      message: 'Amount must be at least ₹1'
                    }
                  })}
                  onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
                />
                {errors.amount && <span className="error">{errors.amount.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="purpose">Donation Purpose</label>
                <select
                  id="purpose"
                  {...register('purpose')}
                >
                  <option value="general">General Fund</option>
                  <option value="education">Education Programs</option>
                  <option value="healthcare">Healthcare Services</option>
                  <option value="disaster_relief">Disaster Relief</option>
                  <option value="cultural_programs">Cultural Programs</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="panNumber">PAN Number (for tax exemption)</label>
                <input
                  type="text"
                  id="panNumber"
                  {...register('panNumber')}
                  placeholder="Optional - for 80G tax benefit"
                />
              </div>

              <div className="form-group">
                <label htmlFor="upiReference">UPI Reference Number *</label>
                <input
                  type="text"
                  id="upiReference"
                  placeholder="Enter 12-digit UPI transaction reference number"
                  {...register('upiReference', { 
                    required: 'UPI reference is required',
                    pattern: {
                      value: /^\d{12}$/,
                      message: 'UPI reference must be exactly 12 digits'
                    }
                  })}
                />
                {errors.upiReference && <span className="error">{errors.upiReference.message}</span>}
                <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>Enter the 12-digit transaction reference number from your UPI payment</small>
              </div>

              <div className="form-group">
                <label htmlFor="paymentScreenshot">Payment Screenshot *</label>
                <input
                  type="file"
                  id="paymentScreenshot"
                  accept="image/*"
                  {...register('paymentScreenshot', { required: 'Payment screenshot is required' })}
                />
                {errors.paymentScreenshot && <span className="error">{errors.paymentScreenshot.message}</span>}
                <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>Upload screenshot of your UPI payment (Max 5MB)</small>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    {...register('isAnonymous')}
                  />
                  Make this donation anonymous
                </label>
              </div>

              <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #90ee90' }}>
                <h4 style={{ color: '#228b22', marginBottom: '1rem' }}>Payment Instructions:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      src="/images/scanner.jpeg" 
                      alt="Payment QR Code" 
                      style={{ width: '120px', height: '120px', border: '2px solid #228b22', borderRadius: '8px' }}
                    />
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#228b22', fontWeight: 'bold' }}>Scan to Pay</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#333' }}>
                      <strong>Bank Details:</strong><br/>
                      Account Name: Sarbo Shakti Sonatani Sangathan<br/>
                      Account No: 43197114593<br/>
                      IFSC: SBIN0032218<br/>
                      Bank: SBI Noida Sector 49
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>
                      Please make payment and enter the transaction reference number above. 
                      Your donation receipt will be generated after payment verification.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Donation'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;