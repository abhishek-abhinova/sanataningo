import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '/api';

const Donate = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const selectAmount = (amount) => {
    setSelectedAmount(amount);
    setValue('amount', amount);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/donations', data);
      
      if (response.data.success) {
        toast.success('Donation submitted successfully! You will receive receipt after payment verification.');
        reset();
        setSelectedAmount('');
        // Redirect to thank you page with details
        window.location.href = `/thank-you?type=donation&donationId=${response.data.donationId}&amount=${data.amount}&name=${encodeURIComponent(data.donorName)}`;
      }
    } catch (error) {
      toast.error('Failed to submit donation. Please try again.');
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
                  {...register('donorName', { required: 'Full name is required' })}
                />
                {errors.donorName && <span className="error">{errors.donorName.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
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
                <label htmlFor="paymentReference">Payment Reference Number *</label>
                <input
                  type="text"
                  id="paymentReference"
                  placeholder="Enter your payment reference/transaction ID"
                  {...register('paymentReference', { required: 'Payment reference is required' })}
                />
                {errors.paymentReference && <span className="error">{errors.paymentReference.message}</span>}
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
                <h4 style={{ color: '#228b22', marginBottom: '0.5rem' }}>Payment Instructions:</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>
                  Please make payment to our account and enter the transaction reference number above. 
                  Your donation receipt will be generated after payment verification by our admin team.
                </p>
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