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

// Response interceptor - NO automatic logout, only manual logout via button
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // No automatic logout - let components handle 401 errors manually
    return Promise.reject(error);
  }
);

export default api;