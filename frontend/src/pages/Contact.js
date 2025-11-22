import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/contact', data);
      
      if (response.data.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        reset();
        // Redirect to thank you page
        window.location.href = `/thank-you?type=contact&name=${encodeURIComponent(data.name)}`;
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-envelope"></i> Contact Us</h1>
          <p>Get in touch with us for any queries or support</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="content-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
            {/* Contact Form */}
            <div className="form-container">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible</p>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { required: 'Full name is required' })}
                  />
                  {errors.name && <span className="error">{errors.name.message}</span>}
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
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject', { required: 'Subject is required' })}
                  />
                  {errors.subject && <span className="error">{errors.subject.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    rows="5"
                    {...register('message', { required: 'Message is required' })}
                  />
                  {errors.message && <span className="error">{errors.message.message}</span>}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2>Contact Information</h2>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <h3><i className="fas fa-map-marker-alt" style={{ color: '#d2691e', marginRight: '10px' }}></i> Address</h3>
                  <p>K-11, S/F, Gali No. 6, Old Gobind Pura<br />Delhi — 110051, India</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3><i className="fas fa-phone" style={{ color: '#d2691e', marginRight: '10px' }}></i> Phone</h3>
                  <p>+91 XXXXX XXXXX</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3><i className="fas fa-envelope" style={{ color: '#d2691e', marginRight: '10px' }}></i> Email</h3>
                  <p>info@sarboshakti.org</p>
                </div>

                <div>
                  <h3><i className="fas fa-clock" style={{ color: '#d2691e', marginRight: '10px' }}></i> Office Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM<br />
                     Saturday: 9:00 AM - 2:00 PM<br />
                     Sunday: Closed</p>
                </div>
              </div>

              <div style={{ marginTop: '2rem', background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <h3>Follow Us</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <a href="#" className="social-link">
                    <i className="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                    <span>Twitter</span>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;