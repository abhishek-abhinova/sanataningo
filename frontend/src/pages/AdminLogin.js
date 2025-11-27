import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import ConnectionTest from '../components/ConnectionTest';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  React.useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.HEALTH, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      console.error('Backend status check failed:', error);
      setBackendStatus('offline');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log('Attempting login to:', API_ENDPOINTS.LOGIN);
      console.log('Login data:', { email: data.email, password: '***' });
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Login result:', result);
      
      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        toast.success('Login successful!');
        navigate('/admin/premium');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Failed to fetch')) {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #8B4513, #D2691E)',
      padding: '2rem'
    }}>
      <ConnectionTest />
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/images/logo.jpeg" 
            alt="Logo" 
            style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }}
          />
          <h2 style={{ color: '#8b4513', marginBottom: '0.5rem' }}>Admin Login</h2>
          <p style={{ color: '#666' }}>Sarbo Shakti Sonatani Sangathan</p>
          
          {/* Backend Status */}
          <div style={{ 
            padding: '0.5rem', 
            borderRadius: '5px', 
            fontSize: '0.8rem',
            marginTop: '1rem',
            background: backendStatus === 'online' ? '#d4edda' : 
                       backendStatus === 'offline' ? '#f8d7da' : '#fff3cd',
            color: backendStatus === 'online' ? '#155724' : 
                   backendStatus === 'offline' ? '#721c24' : '#856404'
          }}>
            Backend: {backendStatus === 'checking' ? '🔄 Checking...' : 
                     backendStatus === 'online' ? '✅ Online' : 
                     backendStatus === 'offline' ? '❌ Offline' : '⚠️ Error'}
            {backendStatus === 'offline' && (
              <div style={{ marginTop: '0.5rem' }}>
                <button 
                  onClick={checkBackendStatus}
                  style={{
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
              Email Address
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
            />
            {errors.email && (
              <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
              Password
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
            />
            {errors.password && (
              <span style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #d2691e, #ff8c00)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
          <p>Default credentials:</p>
          <p><strong>Email:</strong> admin@sarboshakti.org</p>
          <p><strong>Password:</strong> admin123</p>
          <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '5px', fontSize: '0.8rem' }}>
            Backend: {API_ENDPOINTS.LOGIN}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;