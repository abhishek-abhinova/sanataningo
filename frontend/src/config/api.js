const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://sarboshakti-backend.onrender.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // Member endpoints
  MEMBERS: `${API_BASE_URL}/api/members`,
  VERIFY_MEMBERSHIP: `${API_BASE_URL}/api/members/verify`,
  
  // Donation endpoints
  DONATIONS: `${API_BASE_URL}/api/donations`,
  VERIFY_DONATION: `${API_BASE_URL}/api/donations/verify`,
  
  // Contact endpoint
  CONTACT: `${API_BASE_URL}/api/contact`,
  
  // Public endpoints
  PUBLIC_INFO: `${API_BASE_URL}/api/public/info`,
  PUBLIC_TEAM: `${API_BASE_URL}/api/public/team`,
  PUBLIC_GALLERY: `${API_BASE_URL}/api/public/gallery`,
  PUBLIC_ACTIVITIES: `${API_BASE_URL}/api/public/activities`,
  
  // Admin endpoints
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_MEMBERS: `${API_BASE_URL}/api/admin/members`,
  ADMIN_DONATIONS: `${API_BASE_URL}/api/admin/donations`,
  ADMIN_CONTACTS: `${API_BASE_URL}/api/admin/contacts`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`
};

export default API_BASE_URL;