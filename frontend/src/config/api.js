const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://sarboshakti-backend.onrender.com');

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // Member endpoints
  MEMBERS: `${API_BASE_URL}/api/members`,
  MEMBERS_REGISTER: `${API_BASE_URL}/api/members/register`,
  MEMBERS_LIST: `${API_BASE_URL}/api/members/list`,
  MEMBERS_APPROVE: (id) => `${API_BASE_URL}/api/members/approve/${id}`,
  MEMBERS_REJECT: (id) => `${API_BASE_URL}/api/members/reject/${id}`,
  MEMBERS_SEND_CARD: (id) => `${API_BASE_URL}/api/members/member/send-card/${id}`,
  
  // Donation endpoints
  DONATIONS: `${API_BASE_URL}/api/donations`,
  DONATIONS_REGISTER: `${API_BASE_URL}/api/donations/register`,
  DONATIONS_LIST: `${API_BASE_URL}/api/donations/list`,
  DONATIONS_APPROVE: (id) => `${API_BASE_URL}/api/donations/approve/${id}`,
  DONATIONS_SEND_RECEIPT: (id) => `${API_BASE_URL}/api/donations/send-receipt/${id}`,
  
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
  
  // Cloudinary endpoints
  CLOUDINARY_GALLERY: `${API_BASE_URL}/api/cloudinary/gallery`,
  CLOUDINARY_VIDEO: `${API_BASE_URL}/api/cloudinary/video`,
  CLOUDINARY_DELETE: (id) => `${API_BASE_URL}/api/cloudinary/${id}`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`
};

export { API_BASE_URL };
export default API_BASE_URL;