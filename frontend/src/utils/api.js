import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api`,
  timeout: 120000, // 2 minutes for PDF generation + email
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token for protected routes
    const protectedRoutes = ['/admin', '/auth/me', '/members/list', '/donations/list', '/donations?', '/contact', '/media', '/gallery', '/cloudinary'];
    const needsAuth = protectedRoutes.some(route => config.url && config.url.includes(route)) || 
                     (config.url && config.url.includes('/admin/'));
    
    if (needsAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only auto-logout on authentication-related 401 errors, not on timeout/email failures
    if (error.response?.status === 401 && 
        (error.response?.data?.error?.includes('token') || 
         error.response?.data?.error?.includes('auth') ||
         error.config?.url?.includes('/auth/') ||
         error.config?.url?.includes('/login'))) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;