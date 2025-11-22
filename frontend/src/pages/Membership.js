import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '/api';

const Membership = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/members', data);
      
      if (response.data.success) {
        toast.success('Membership application submitted successfully! You will receive confirmation after payment verification.');
        reset();
        // Redirect to thank you page with details
        window.location.href = `/thank-you?type=membership&membershipId=${response.data.membershipId}&name=${encodeURIComponent(data.fullName)}`;
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
                <label htmlFor="paymentReference">Payment Reference Number *</label>
                <input
                  type="text"
                  id="paymentReference"
                  placeholder="Enter your payment reference/transaction ID"
                  {...register('paymentReference', { required: 'Payment reference is required' })}
                />
                {errors.paymentReference && <span className="error">{errors.paymentReference.message}</span>}
              </div>

              <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #90ee90' }}>
                <h4 style={{ color: '#228b22', marginBottom: '0.5rem' }}>Payment Instructions:</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>
                  Please make payment to our account and enter the transaction reference number above. 
                  Your membership will be activated after payment verification by our admin team.
                </p>
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