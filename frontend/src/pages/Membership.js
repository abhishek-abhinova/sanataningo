import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Membership = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'paymentScreenshot') {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });
      
      const response = await api.post('/members/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success('Membership application submitted successfully!');
        reset();
        navigate('/thank-you-member', { 
          state: { memberData: response.data.member } 
        });
      }
    } catch (error) {
      toast.error('Failed to submit membership application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-users"></i> Become a Member</h1>
          <p>Join our spiritual family and be part of the divine mission</p>
        </div>
      </section>

      {/* Membership Form */}
      <section className="content-section">
        <div className="container">
          <div className="form-container">
            <h2>Membership Registration</h2>
            <p>Fill out the form below to become a member of Sarboshakti Sanatani Sangathan</p>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  {...register('fullName', { required: 'Full name is required' })}
                />
                {errors.fullName && <span className="error">{errors.fullName.message}</span>}
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
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  {...register('dateOfBirth', { required: 'Date of birth is required' })}
                />
                {errors.dateOfBirth && <span className="error">{errors.dateOfBirth.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="occupation">Occupation *</label>
                <input
                  type="text"
                  id="occupation"
                  {...register('occupation', { required: 'Occupation is required' })}
                />
                {errors.occupation && <span className="error">{errors.occupation.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="aadhaarNumber">Aadhaar Number *</label>
                <input
                  type="text"
                  id="aadhaarNumber"
                  placeholder="Enter 12-digit Aadhaar number"
                  {...register('aadhaarNumber', { 
                    required: 'Aadhaar number is required',
                    pattern: {
                      value: /^[0-9]{12}$/,
                      message: 'Please enter a valid 12-digit Aadhaar number'
                    }
                  })}
                />
                {errors.aadhaarNumber && <span className="error">{errors.aadhaarNumber.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="membershipType">Membership Type *</label>
                <select
                  id="membershipType"
                  {...register('membershipType', { required: 'Please select membership type' })}
                >
                  <option value="">Select Membership Type</option>
                  <option value="basic">Basic - ₹100</option>
                  <option value="premium">Premium - ₹500</option>
                  <option value="lifetime">Lifetime - ₹2000</option>
                </select>
                {errors.membershipType && <span className="error">{errors.membershipType.message}</span>}
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
                      Your membership will be activated after payment verification.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;