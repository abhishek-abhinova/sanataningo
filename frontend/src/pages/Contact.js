import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../config/api';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true); 
    try {
      const response = await fetch(API_ENDPOINTS.CONTACT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        reset();
        // Redirect to thank you page
        window.location.href = `/thank-you?type=contact&name=${encodeURIComponent(data.name)}`;
        console.log('Contact form submitted successfully:', result);
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
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

            {/* Contact Information - Two Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Official Column */}
              <div>
                <h2 style={{ color: '#8b4513', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-building" style={{ color: '#d2691e', marginRight: '10px' }}></i>
                  Official
                </h2>
                
                <div style={{ background: 'linear-gradient(135deg, #fff8f0, #fef6ed)', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '2px solid #d2691e', marginBottom: '2rem' }}>
                  <h3 style={{ color: '#8b4513', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#d2691e', marginRight: '10px' }}></i>
                    Registered Office
                  </h3>
                  <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontWeight: '600', color: '#8b4513', lineHeight: '1.8', margin: 0 }}>
                      🏢 <strong>Sarbo Shakti Sonatani Sangathan</strong><br/>
                      19, Kalyan Kunj, Sector 49<br/>
                      Gautam Buddha Nagar, Uttar Pradesh-231301
                    </p>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #e9ecef', marginBottom: '2rem' }}>
                  <h3 style={{ color: '#8b4513', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-users" style={{ color: '#d2691e', marginRight: '10px' }}></i>
                    Officials Contact
                  </h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', borderRadius: '10px', border: '1px solid #dee2e6' }}>
                      <h4 style={{ color: '#8b4513', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Mr. Ajit Kumar Ray</h4>
                      <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: '#6c757d' }}><strong>Chief General Secretary</strong></p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#495057' }}><i className="fas fa-phone" style={{ color: '#d2691e', marginRight: '5px' }}></i> +91 9907916429</p>
                    </div>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', borderRadius: '10px', border: '1px solid #dee2e6' }}>
                      <h4 style={{ color: '#8b4513', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Shri Goutam Chandra Biswas</h4>
                      <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: '#6c757d' }}><strong>Cashier</strong></p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#495057' }}><i className="fas fa-phone" style={{ color: '#d2691e', marginRight: '5px' }}></i> +91 9868362375</p>
                    </div>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', borderRadius: '10px', border: '1px solid #dee2e6' }}>
                      <h4 style={{ color: '#8b4513', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Shriwas Halder</h4>
                      <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: '#6c757d' }}><strong>Official Secretary</strong></p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#495057' }}><i className="fas fa-phone" style={{ color: '#d2691e', marginRight: '5px' }}></i> +91 9816195600</p>
                    </div>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', borderRadius: '10px', border: '1px solid #dee2e6' }}>
                      <h4 style={{ color: '#8b4513', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Mr. Dinesh Bairagi</h4>
                      <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: '#6c757d' }}><strong>President & Founder</strong></p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#495057' }}><i className="fas fa-phone" style={{ color: '#d2691e', marginRight: '5px' }}></i> +91 8584871180</p>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' }}>
                  <h3 style={{ color: '#8b4513', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-clock" style={{ color: '#d2691e', marginRight: '10px' }}></i>
                    Office Hours
                  </h3>
                  <div style={{ background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)', padding: '1.5rem', borderRadius: '10px', border: '1px solid #28a745' }}>
                    <p style={{ margin: 0, color: '#155724', lineHeight: '1.8' }}>
                      <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM<br/>
                      <strong>Saturday:</strong> 9:00 AM - 2:00 PM<br/>
                      <strong>Sunday:</strong> Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Column */}
              <div>
                <h2 style={{ color: '#8b4513', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-headset" style={{ color: '#17a2b8', marginRight: '10px' }}></i>
                  Support
                </h2>
                
                <div style={{ background: 'linear-gradient(135deg, #d1ecf1, #bee5eb)', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '2px solid #17a2b8', marginBottom: '2rem' }}>
                  <h3 style={{ color: '#0c5460', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-envelope" style={{ color: '#17a2b8', marginRight: '10px' }}></i>
                    Email Support
                  </h3>
                  <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: '0 0 1rem 0', color: '#495057' }}><strong>General Inquiries:</strong></p>
                    <p style={{ margin: '0 0 1rem 0', color: '#17a2b8', fontWeight: 'bold' }}>info@sarboshaktisonatanisangathan.org</p>
                    <p style={{ margin: '0 0 1rem 0', color: '#495057' }}><strong>Membership Support:</strong></p>
                    <p style={{ margin: '0', color: '#17a2b8', fontWeight: 'bold' }}>info@sarboshaktisonatanisangathan.org</p>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #e9ecef', marginBottom: '2rem' }}>
                  <h3 style={{ color: '#8b4513', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-phone-alt" style={{ color: '#28a745', marginRight: '10px' }}></i>
                    Support Team
                  </h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)', borderRadius: '10px', border: '1px solid #28a745' }}>
                      <h4 style={{ color: '#155724', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Shri Pratap Malik</h4>
                      <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: '#6c757d' }}><strong> Support</strong></p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#495057' }}><i className="fas fa-phone" style={{ color: '#28a745', marginRight: '5px' }}></i> +91 7827359897</p>
                    </div>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)', borderRadius: '10px', border: '1px solid #28a745' }}>
                      <h4 style={{ color: '#155724', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Tarak Chandra Pal</h4>
                      <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: '#6c757d' }}><strong>Support</strong></p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#495057' }}><i className="fas fa-phone" style={{ color: '#28a745', marginRight: '5px' }}></i> +91 8826069880</p>
                    </div>
                    <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)', borderRadius: '10px', border: '1px solid #28a745' }}>
                      <h4 style={{ color: '#155724', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Amiyo Biswas</h4>
                      <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.9rem', color: '#6c757d' }}><strong>Support</strong></p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#495057' }}><i className="fas fa-phone" style={{ color: '#28a745', marginRight: '5px' }}></i> +91 9765212583</p>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' }}>
                  <h3 style={{ color: '#8b4513', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-share-alt" style={{ color: '#6f42c1', marginRight: '10px' }}></i>
                    Follow Us
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <a href="https://www.facebook.com/share/1G7CvWCqd8/" target="_blank" rel="noopener noreferrer" 
                       style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', background: 'linear-gradient(135deg, #3b5998, #4267B2)', color: 'white', textDecoration: 'none', borderRadius: '10px', transition: 'transform 0.3s ease' }}
                       onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                       onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                      <i className="fab fa-facebook-f" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                      <span style={{ fontSize: '0.8rem' }}>Facebook</span>
                    </a>
                    <a href="#" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', background: 'linear-gradient(135deg, #1da1f2, #0d8bd9)', color: 'white', textDecoration: 'none', borderRadius: '10px', transition: 'transform 0.3s ease' }}
                       onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                       onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                      <i className="fab fa-twitter" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                      <span style={{ fontSize: '0.8rem' }}>Twitter</span>
                    </a>
                    <a href="#" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', background: 'linear-gradient(135deg, #e4405f, #c13584)', color: 'white', textDecoration: 'none', borderRadius: '10px', transition: 'transform 0.3s ease' }}
                       onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                       onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                      <i className="fab fa-instagram" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                      <span style={{ fontSize: '0.8rem' }}>Instagram</span>
                    </a>
                  </div>
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