import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="login-header">
          <motion.div 
            className="logo-container"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <img src="/images/logo.jpeg" alt="Logo" className="login-logo" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Admin Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Sarbo Shakti Sonatani Sangathan
          </motion.p>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="login-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="form-group">
            <div className="input-container">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="login-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </motion.button>
        </motion.form>


      </motion.div>

      <style>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .login-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #FF8C00 100%);
          z-index: -2;
        }

        .login-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/images/pattern.png') repeat;
          opacity: 0.1;
          z-index: -1;
        }

        .login-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }

        .login-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #d2691e, #ff8c00);
        }

        .login-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .logo-container {
          margin-bottom: 1.5rem;
        }

        .login-logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid #d2691e;
          box-shadow: 0 10px 30px rgba(210, 105, 30, 0.3);
        }

        .login-header h1 {
          margin: 0 0 0.5rem 0;
          color: #1a202c;
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #d2691e, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-header p {
          margin: 0;
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          position: relative;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 2;
          font-size: 1rem;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 1rem 3.5rem 1rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          box-sizing: border-box;
        }
        
        .form-input::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }

        .form-input:focus {
          outline: none;
          border-color: #d2691e;
          box-shadow: 0 0 0 3px rgba(210, 105, 30, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.3s ease;
          z-index: 3;
        }

        .password-toggle:hover {
          color: #d2691e;
          background: rgba(210, 105, 30, 0.1);
        }

        .login-button {
          width: 100%;
          padding: 1.2rem 2rem;
          background: linear-gradient(135deg, #d2691e, #ff8c00);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 12px 30px rgba(210, 105, 30, 0.4);
          margin-top: 1rem;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(210, 105, 30, 0.4);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 2rem;
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .login-footer p {
          margin: 0 0 1rem 0;
          color: #64748b;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }



        @media (max-width: 768px) {
          .login-card {
            margin: 1rem;
            padding: 2rem;
          }

          .login-header h1 {
            font-size: 1.75rem;
          }

          .login-logo {
            width: 60px;
            height: 60px;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .login-logo {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
