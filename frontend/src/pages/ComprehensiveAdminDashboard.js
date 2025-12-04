import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { API_BASE_URL } from '../config/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import useAutoLogout from '../hooks/useAutoLogout';
// import io from 'socket.io-client'; // Disabled for production

const ComprehensiveAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [data, setData] = useState({
    members: [],
    donations: [],
    contacts: [],
    team: [],
    events: [],
    gallery: [],
    activities: []
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [socket, setSocket] = useState(null);
  const [membersPage, setMembersPage] = useState(1);
  const [donationsPage, setDonationsPage] = useState(1);
  const itemsPerPage = 5;

  // Auto-logout functionality
  useAutoLogout();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      // Load initial gallery data from Cloudinary
      fetchData('/cloudinary/gallery', 'gallery');

      // Only refresh dashboard stats, not all data
      const interval = setInterval(() => {
        fetchDashboardData();
      }, 30000); // Reduced frequency to 30 seconds

      // Socket.io disabled for production
      // const newSocket = io(process.env.REACT_APP_BACKEND_URL);
      // setSocket(newSocket);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]);



  const generateIdCard = async (member) => {
    try {
      const response = await api.post(`/admin/team/${member._id}/generate-id-card`);
      if (response.data.success) {
        toast.success('ID card generated and sent to email!');
      }
    } catch (error) {
      console.error('ID card generation failed:', error);
      toast.error('Failed to generate ID card');
    }
  };

  const handleRealTimeUpdate = (update) => {
    const { type, data } = update;

    switch (type) {
      case 'gallery':
        if (data.action === 'create') {
          setData(prev => ({ ...prev, gallery: [data.item, ...prev.gallery] }));
          toast.success('New gallery item added!');
        } else if (data.action === 'update') {
          setData(prev => ({ ...prev, gallery: prev.gallery.map(item => item._id === data.item._id ? data.item : item) }));
          toast.info('Gallery item updated!');
        } else if (data.action === 'delete') {
          setData(prev => ({ ...prev, gallery: prev.gallery.filter(item => item._id !== data.id) }));
          toast.info('Gallery item deleted!');
        }
        break;
      case 'team':
        if (data.action === 'create') {
          setData(prev => ({ ...prev, team: [data.item, ...prev.team] }));
          toast.success('New team member added!');
        } else if (data.action === 'update') {
          setData(prev => ({ ...prev, team: prev.team.map(item => item._id === data.item._id ? data.item : item) }));
          toast.info('Team member updated!');
        } else if (data.action === 'delete') {
          setData(prev => ({ ...prev, team: prev.team.filter(item => item._id !== data.id) }));
          toast.info('Team member deleted!');
        }
        break;
      case 'events':
        if (data.action === 'create') {
          setData(prev => ({ ...prev, events: [data.item, ...prev.events] }));
          toast.success('New event added!');
        } else if (data.action === 'update') {
          setData(prev => ({ ...prev, events: prev.events.map(item => item._id === data.item._id ? data.item : item) }));
          toast.info('Event updated!');
        } else if (data.action === 'delete') {
          setData(prev => ({ ...prev, events: prev.events.filter(item => item._id !== data.id) }));
          toast.info('Event deleted!');
        }
        break;
      case 'members':
        if (data.action === 'update') {
          setData(prev => ({ ...prev, members: prev.members.map(item => item._id === data.item._id ? data.item : item) }));
          toast.info('Member status updated!');
        } else if (data.action === 'delete') {
          setData(prev => ({ ...prev, members: prev.members.filter(item => item._id !== data.id) }));
          toast.info('Member deleted!');
        }
        break;
      default:
        break;
    }

    // Refresh dashboard stats
    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setStats({
        totalMembers: 0,
        activeMembers: 0,
        pendingMembers: 0,
        totalDonationAmount: 0,
        totalContacts: 0
      });
    }
  };

  const fetchData = async (endpoint, key) => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      const dataKey = key === 'gallery' ? 'gallery' : key === 'team' ? 'team' : key === 'events' ? 'events' : key;
      const responseData = response.data[dataKey] || response.data.data || response.data || [];
      setData(prev => ({ ...prev, [key]: Array.isArray(responseData) ? responseData : [] }));
    } catch (error) {
      console.error(`Failed to fetch ${key}:`, error);
      setData(prev => ({ ...prev, [key]: [] }));
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'members': await fetchData('/admin/members', 'members'); break;
      case 'donations': await fetchData('/admin/donations', 'donations'); break;
      case 'contacts': await fetchData('/admin/contacts', 'contacts'); break;
      case 'team': await fetchData('/admin/team', 'team'); break;
      case 'events': await fetchData('/admin/events', 'events'); break;
      case 'activities': await fetchData('/admin/activities', 'activities'); break;
      case 'gallery': await fetchData('/cloudinary/gallery', 'gallery'); break;
    }
  };

  const deleteItem = async (type, id) => {
    if (!id) {
      toast.error('Invalid item ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/admin/${type}/${id}`);
        toast.success(`${type} deleted successfully`);
        await fetchData(`/admin/${type}`, type);
      } catch (error) {
        console.error(`Delete ${type} error:`, error);
        toast.error(`Failed to delete ${type}: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  const renderDashboard = () => (
    <motion.div
      className="dashboard-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stats-grid">
        {[
          { icon: 'fas fa-users', title: 'Total Members', value: (stats.totalMembers || 0) + (stats.totalTeamMembers || 0), color: '#667eea', trend: '+12%' },
          { icon: 'fas fa-rupee-sign', title: 'Total Donations', value: `₹${(stats.totalDonationAmount || 0).toLocaleString()}`, color: '#10b981', trend: '+8%' },
      { icon: 'fas fa-clock', title: 'Pending Approvals', value: stats.pendingMembers || 0, color: '#f59e0b', trend: '-5%' },
      { icon: 'fas fa-envelope', title: 'Messages', value: stats.totalContacts || 0, color: '#d2691e', trend: '+15%' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8, scale: 1.02, rotateY: 5 }}
          >
            <div className="stat-icon" style={{
              background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
              boxShadow: `0 10px 20px ${stat.color}40`
            }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-number">{stat.value}</p>
              <div style={{
                fontSize: '0.8rem',
                color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444',
                fontWeight: '600',
                marginTop: '0.5rem'
              }}>
                <i className={`fas fa-arrow-${stat.trend.startsWith('+') ? 'up' : 'down'}`}></i> {stat.trend} this month
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <div className="section-header">
          <h2><i className="fas fa-chart-line"></i> Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: 'fas fa-user-plus', title: 'Add Team Member', action: () => { setActiveTab('team'); setEditingItem({ type: 'team', data: {} }); }, color: '#d2691e' },
            { icon: 'fas fa-images', title: 'Upload Gallery', action: () => { setActiveTab('gallery'); setEditingItem({ type: 'gallery', data: { type: 'photo' } }); }, color: '#10b981' },
            { icon: 'fas fa-calendar-plus', title: 'Create Event', action: () => { setActiveTab('events'); setEditingItem({ type: 'events', data: {} }); }, color: '#f59e0b' },
            { icon: 'fas fa-newspaper', title: 'Add Activity', action: () => { setActiveTab('activities'); setEditingItem({ type: 'activities', data: {} }); }, color: '#8b5cf6' }
          ].map((action, index) => (
            <motion.button
              key={action.title}
              onClick={action.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)`,
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '1.5rem',
                cursor: 'pointer',
                boxShadow: `0 10px 20px ${action.color}30`,
                transition: 'all 0.3s ease'
              }}
            >
              <i className={action.icon} style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{action.title}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderMembersManagement = () => {
    const filteredMembers = data.members.filter(member => {
      const matchesSearch = member.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    const paginatedMembers = filteredMembers.slice(0, membersPage * itemsPerPage);
    const hasMore = filteredMembers.length > paginatedMembers.length;

    return (
      <motion.div
        className="admin-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-header">
          <h2><i className="fas fa-users"></i> Members Management</h2>
        </div>

        <div className="table-controls">
          <div className="search-filter">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="enhanced-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Member ID</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((member, index) => (
                <motion.tr
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td>{member.fullName}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{member.member_id || '-'}</td>
                  <td>{member.membership_type || '-'}</td>
                  <td>{member.membership_fee ? `₹${member.membership_fee}` : '-'}</td>
                  <td>
                    <span className={`status-badge ${member.payment_status || 'pending'}`}>
                      {member.payment_status || 'pending'}
                    </span>
                  </td>
                  <td>{member.city || '-'}</td>
                  <td>
                    <span className={`status-badge ${member.status}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        onClick={() => setEditingItem({ type: 'member', data: member })}
                        className="btn-icon btn-edit"
                        title="View details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <select
                        value={member.payment_status || 'pending'}
                        onChange={async (e) => {
                          try {
                            const next = e.target.value;
                            await api.put(`/admin/members/${member._id}`, { payment_status: next });
                            toast.success('Payment status updated');
                            await fetchData('/admin/members', 'members');
                          } catch (err) {
                            toast.error(err.response?.data?.error || 'Failed to update payment status');
                          }
                        }}
                        style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                      >
                        <option value="pending">pending</option>
                        <option value="completed">completed</option>
                        <option value="failed">failed</option>
                      </select>
                      <button
                        onClick={async () => {
                          try {
                            const next = member.status === 'active' ? 'inactive' : 'active';
                            if (next === 'active') {
                              await api.put(`/admin/members/${member._id}/activate`);
                              toast.success('Member activated and activation email sent');
                            } else {
                              await api.put(`/admin/members/${member._id}`, { status: next });
                              toast.success('Member marked as inactive');
                            }
                            await fetchData('/admin/members', 'members');
                          } catch (err) {
                            toast.error(err.response?.data?.error || 'Failed to update status');
                          }
                        }}
                        className="btn-icon"
                        title={member.status === 'active' ? 'Set inactive' : 'Set active'}
                        style={{ background: member.status === 'active' ? '#ffc107' : '#28a745', color: 'white' }}
                      >
                        <i className={member.status === 'active' ? 'fas fa-user-slash' : 'fas fa-user-check'}></i>
                      </button>
                      <button
                        onClick={() => deleteItem('members', member._id)}
                        className="btn-icon btn-delete"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => setMembersPage(membersPage + 1)}
              className="btn-primary"
              style={{ minWidth: '200px' }}
            >
              <i className="fas fa-chevron-down"></i> Show More ({filteredMembers.length - paginatedMembers.length} more)
            </button>
          </div>
        )}

        {editingItem?.type === 'member' && (
          <MemberDetailsModal member={editingItem.data} onClose={() => setEditingItem(null)} />
        )}
      </motion.div>
    );
  };

  const MemberDetailsModal = ({ member, onClose }) => {
    const imageSrc = (p) => (p ? (p.startsWith('http') ? p : `${API_BASE_URL}/${p.replace(/^\/*/, '')}`) : null);
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal large" onClick={(e) => e.stopPropagation()}>
          <h3>Member Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p><strong>Name:</strong> {member.fullName}</p>
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Phone:</strong> {member.phone}</p>
              <p><strong>Member ID:</strong> {member.member_id}</p>
              <p><strong>Plan:</strong> {member.membership_type}</p>
              <p><strong>Amount:</strong> {member.membership_fee ? `₹${member.membership_fee}` : '-'}</p>
              <p><strong>Payment:</strong> {member.payment_status}</p>
              <p><strong>Status:</strong> {member.status}</p>
              <p><strong>City:</strong> {member.city || '-'}</p>
              <p><strong>Created:</strong> {member.created_at}</p>
            </div>
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: 600 }}>Payment Screenshot</p>
                {imageSrc(member.payment_id) ? (
                  <img src={imageSrc(member.payment_id)} alt="Payment" style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '12px' }} onClick={() => window.open(imageSrc(member.payment_id), '_blank')} />
                ) : (
                  <small>No screenshot uploaded</small>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>Aadhaar Front</p>
                  {imageSrc(member.aadhaar_front_image) ? (
                    <img src={imageSrc(member.aadhaar_front_image)} alt="Aadhaar Front" style={{ width: '100%', maxHeight: '260px', objectFit: 'contain', borderRadius: '12px' }} onClick={() => window.open(imageSrc(member.aadhaar_front_image), '_blank')} />
                  ) : (
                    <small>Not provided</small>
                  )}
                </div>
                <div>
                  <p style={{ fontWeight: 600 }}>Aadhaar Back</p>
                  {imageSrc(member.aadhaar_back_image) ? (
                    <img src={imageSrc(member.aadhaar_back_image)} alt="Aadhaar Back" style={{ width: '100%', maxHeight: '260px', objectFit: 'contain', borderRadius: '12px' }} onClick={() => window.open(imageSrc(member.aadhaar_back_image), '_blank')} />
                  ) : (
                    <small>Not provided</small>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  const DonationScreenshotModal = ({ donation, onClose }) => {
    const src = donation?.paymentScreenshot ? `${API_BASE_URL}/${String(donation.paymentScreenshot).replace(/^\/*/, '')}` : null;
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal large" onClick={(e) => e.stopPropagation()}>
          <h3>Donation Screenshot</h3>
          {src ? (
            <img src={src} alt="Payment Screenshot" style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px' }} />
          ) : (
            <small>No screenshot available</small>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn-secondary" onClick={onClose}>Close</button>
            {src && (
              <button className="btn-primary" onClick={() => window.open(src, '_blank')}>Open</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGalleryManagement = () => (
    <motion.div className="admin-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="section-header">
        <h2><i className="fas fa-images"></i> Gallery Management</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setEditingItem({ type: 'gallery', data: { type: 'photo' } })}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <i className="fas fa-plus"></i> Add Images
          </button>
          <button
            onClick={() => setEditingItem({ type: 'gallery', data: { type: 'video' } })}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #28a745, #20c997)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
            }}
          >
            <i className="fas fa-video"></i> Add Videos
          </button>
        </div>
      </div>

      <div className="gallery-grid">
        {Array.isArray(data.gallery)
          ? data.gallery
            .filter(item => item && (item._id || item.id))
            .map((item, index) => {
              const id = item._id || item.id;
              const rawUrl = item.image_url || item.image || item.file || item.imageUrl || '';
              const isExternal = typeof rawUrl === 'string' && /^https?:\/\//i.test(rawUrl);
              const fullUrl = rawUrl
                ? (isExternal ? rawUrl : (rawUrl.startsWith('/') ? `${API_BASE_URL}${rawUrl}` : `${API_BASE_URL}/${rawUrl}`))
                : '/images/placeholder.jpg';
              const isVideo = /\.(mp4|webm|ogg|avi|mov)$/i.test(rawUrl || '') ||
                (rawUrl || '').includes('youtube.com') ||
                (rawUrl || '').includes('youtu.be');

              return (
                <motion.div
                  key={id}
                  className="gallery-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {isVideo ? (
                    rawUrl && (rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be')) ? (
                      <iframe
                        src={fullUrl}
                        title={item?.title || 'Gallery video'}
                        style={{ width: '100%', height: '180px', border: 'none', borderRadius: '8px' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={fullUrl}
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
                        controls
                      />
                    )
                  ) : (
                    <img
                      src={fullUrl}
                      alt={item?.title || 'Gallery item'}
                      onError={(e) => {
                        console.log('Gallery image error:', fullUrl);
                        e.target.src = '/images/placeholder.jpg';
                      }}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}
                  <div className="gallery-info">
                    <h4>{item?.title || 'Untitled'}</h4>
                    <p>{item?.description || 'No description'}</p>
                    <div className="gallery-actions">
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this item?')) {
                            api.delete(`/cloudinary/${id}`).then(() => {
                              toast.success('Gallery item deleted successfully');
                              fetchData('/cloudinary/gallery', 'gallery');
                            }).catch(error => {
                              console.error('Delete error:', error);
                              toast.error('Failed to delete item');
                            });
                          }
                        }}
                        className="btn-icon btn-delete"
                        title="Delete item"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          : []}
      </div>

      {editingItem?.type === 'gallery' && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingItem.data._id ? 'Edit' : 'Add'} Gallery Item</h3>
            <GalleryForm data={editingItem.data} onSave={(data) => saveGalleryItem(data)} onCancel={() => setEditingItem(null)} />
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderActivitiesManagement = () => (
    <motion.div className="admin-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="section-header">
        <h2><i className="fas fa-newspaper"></i> Activities Management</h2>
        <button onClick={() => setEditingItem({ type: 'activities', data: {} })} className="btn-primary">
          <i className="fas fa-plus"></i> Add Activity
        </button>
      </div>

      <div className="events-grid">
        {(data.activities || []).map((activity, index) => (
          <motion.div key={activity.id || activity._id} className="event-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <div className="event-header">
              <h4>{activity.title}</h4>
              <span className={`status-badge ${activity.category || 'event'}`}>{activity.category || 'event'}</span>
            </div>
            <p>{activity.description || 'No description'}</p>
            <div className="event-details">
              {activity.created_at && <small><i className="fas fa-calendar"></i> {new Date(activity.created_at).toLocaleDateString()}</small>}
              {activity.is_active !== undefined && (
                <small style={{ color: activity.is_active ? '#28a745' : '#6c757d' }}>
                  <i className={`fas fa-${activity.is_active ? 'check-circle' : 'times-circle'}`}></i> {activity.is_active ? 'Active' : 'Inactive'}
                </small>
              )}
            </div>
            {activity.image_url && (
              <div style={{ marginTop: '1rem' }}>
                <img
                  src={activity.image_url.startsWith('http') ? activity.image_url : `${API_BASE_URL}${activity.image_url}`}
                  alt={activity.title}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            )}
            <div className="event-actions">
              <button onClick={() => setEditingItem({ type: 'activities', data: activity })} className="btn-icon btn-edit">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => deleteItem('activities', activity.id || activity._id)} className="btn-icon btn-delete">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {editingItem?.type === 'activities' && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{(editingItem.data._id || editingItem.data.id) ? 'Edit' : 'Add'} Activity</h3>
            <ActivityForm data={editingItem.data} onSave={(data) => saveItem('activities', data)} onCancel={() => setEditingItem(null)} />
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderEventsManagement = () => (
    <motion.div className="admin-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="section-header">
        <h2><i className="fas fa-calendar"></i> Events Management</h2>
        <button onClick={() => setEditingItem({ type: 'events', data: {} })} className="btn-primary">
          <i className="fas fa-plus"></i> Add Event
        </button>
      </div>

      <div className="events-grid">
        {(data.events || []).map((event, index) => (
          <motion.div key={event.id || event._id} className="event-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <div className="event-header">
              <h4>{event.title}</h4>
              <span className={`status-badge ${event.status || 'upcoming'}`}>{event.status || 'upcoming'}</span>
            </div>
            <p>{event.description || 'No description'}</p>
            <div className="event-details">
              {event.event_date && <small><i className="fas fa-calendar"></i> {new Date(event.event_date).toLocaleDateString()}</small>}
              {event.location && <small><i className="fas fa-map-marker-alt"></i> {event.location}</small>}
            </div>
            {event.image_url && (
              <div style={{ marginTop: '1rem' }}>
                <img
                  src={event.image_url.startsWith('http') ? event.image_url : `${API_BASE_URL}${event.image_url}`}
                  alt={event.title}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            )}
            <div className="event-actions">
              <button onClick={() => setEditingItem({ type: 'events', data: event })} className="btn-icon btn-edit">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => deleteItem('events', event.id || event._id)} className="btn-icon btn-delete">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {editingItem?.type === 'events' && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{(editingItem.data._id || editingItem.data.id) ? 'Edit' : 'Add'} Event</h3>
            <EventForm data={editingItem.data} onSave={(data) => saveItem('events', data)} onCancel={() => setEditingItem(null)} />
          </div>
        </div>
      )}
    </motion.div>
  );



  const renderTeamManagement = () => (
    <motion.div className="admin-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="section-header">
        <h2><i className="fas fa-user-tie"></i> Team Management</h2>
        <button onClick={() => setEditingItem({ type: 'team', data: {} })} className="btn-primary">
          <i className="fas fa-plus"></i> Add Member
        </button>
      </div>
      <div className="team-grid">
        {(data.team || []).map((member, index) => (
          <motion.div key={member.id || member._id} className="team-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
            {member.photo_url && (
              <img 
                src={member.photo_url.startsWith('http') ? member.photo_url : `${API_BASE_URL}/${String(member.photo_url).replace(/^\/*/, '')}`} 
                alt={member.name} 
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} 
              />
            )}
            <h4>{member.name} - Core Member</h4>

            {member.category && (<span className={`status-badge ${member.category}`}>{member.category}</span>)}
            <div style={{
              fontSize: '0.8rem',
              color: member.is_active ? '#28a745' : '#6c757d',
              fontWeight: '600',
              marginTop: '0.5rem'
            }}>
              {member.is_active ? '✓ Visible in Team' : '✗ Hidden from Team'}
            </div>
            <div className="team-actions">
              <button
                onClick={() => toggleTeamVisibility(member.id || member._id, !!member.is_active)}
                className="btn-icon"
                style={{
                  background: member.is_active ? '#28a745' : '#6c757d',
                  color: 'white',
                  fontSize: '0.8rem'
                }}
                title={member.is_active ? 'Hide from team section' : 'Show in team section'}
              >
                <i className={member.is_active ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
              </button>
              <button
                onClick={() => downloadTeamIdCard(member)}
                className="btn-icon"
                style={{ background: '#17a2b8', color: 'white' }}
                title="Download ID Card PDF"
              >
                <i className="fas fa-id-card"></i>
              </button>
              <button onClick={() => setEditingItem({ type: 'team', data: member })} className="btn-icon btn-edit">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => deleteItem('team', member.id || member._id)} className="btn-icon btn-delete">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {editingItem?.type === 'team' && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{(editingItem.data._id || editingItem.data.id) ? 'Edit' : 'Add'} Team Member</h3>
            <TeamForm data={editingItem.data} onSave={(data) => saveItem('team', data)} onCancel={() => setEditingItem(null)} />
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderContactsManagement = () => (
    <motion.div className="admin-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="section-header">
        <h2><i className="fas fa-envelope"></i> Contact Messages</h2>
      </div>
      <div className="contacts-list">
        {data.contacts.map((contact, index) => (
          <motion.div key={contact._id} className="contact-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <div className="contact-header">
              <h4>{contact.name}</h4>
              <small>{new Date(contact.createdAt).toLocaleDateString()}</small>
            </div>
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Phone:</strong> {contact.phone}</p>
            <p><strong>Message:</strong> {contact.message}</p>
            <div className="contact-actions">
              <button onClick={() => deleteItem('contacts', contact._id)} className="btn-icon btn-delete">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const toggleTeamVisibility = async (id, currentVisibility) => {
    try {
      const response = await api.put(`/admin/team/${id}`, { is_active: !currentVisibility });
      if (response.data.success) {
        toast.success(`Team member ${currentVisibility ? 'hidden from' : 'shown in'} team section`);
        await fetchData('/admin/team', 'team');
      }
    } catch (error) {
      console.error('Toggle visibility error:', error);
      toast.error('Failed to update visibility: ' + (error.response?.data?.error || error.message));
    }
  };

  const downloadTeamIdCard = async (member) => {
    try {
      const id = member.id || member._id;
      const response = await api.get(`/admin/team/${id}/id-card.pdf`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `team-id-card-TM${String(id).padStart(6, '0')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download ID card error:', error);
      toast.error('Failed to download ID card');
    }
  };

  const sendDonationReceipt = async (donation) => {
    try {
      await api.post(`/admin/donations/${donation._id}/send-receipt`);
      toast.success(`Receipt sent to ${donation.donorEmail}`);
    } catch (error) {
      console.error('Send receipt error:', error);
      toast.error('Failed to send receipt: ' + (error.response?.data?.error || error.message));
    }
  };

  const saveItem = async (type, data) => {
    try {
      const endpoint = data._id || data.id ? `/admin/${type}/${data._id || data.id}` : `/admin/${type}`;
      const method = (data._id || data.id) ? 'put' : 'post';
      let payload = { ...data };

      if (type === 'events') {
        payload = {
          title: data.title,
          description: data.description || '',
          location: data.location || data.venue || '',
          event_date: data.event_date || data.eventDate,
          status: data.status || 'upcoming',
          image_url: data.image_url || null,
          category: data.category || null
        };
        if (data._id || data.id) {
          // Don't include _id in update payload
          delete payload._id;
          delete payload.id;
        }
      } else if (type === 'activities') {
        payload = {
          title: data.title,
          description: data.description || '',
          image_url: data.image_url || data.image || null,
          category: data.category || 'event',
          is_active: data.is_active !== undefined ? data.is_active : true
        };
        if (data._id || data.id) {
          delete payload._id;
          delete payload.id;
        }
        console.log('Activity payload:', payload);
      } else if (type === 'team') {
        payload = {
          name: data.name,
          designation: data.designation || data.position,
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          photo_url: data.photo_url || data.photo || '',
          is_active: data.is_active !== undefined ? data.is_active : (data.showInTeam !== undefined ? data.showInTeam : true)
        };
        if (data.category) {
          payload.category = data.category;
        }
        if (data._id || data.id) {
          delete payload._id;
          delete payload.id;
        }
      }

      await api[method](endpoint, payload);
      toast.success(`${type} ${(data._id || data.id) ? 'updated' : 'created'} successfully`);
      setEditingItem(null);
      // Refresh data immediately
      await fetchData(`/admin/${type}`, type);
      // Also refresh dashboard stats
      await fetchDashboardData();
    } catch (error) {
      console.error(`Save ${type} error:`, error);
      toast.error(`Failed to save ${type}: ${error.response?.data?.error || error.message}`);
    }
  };

  const saveGalleryItem = async (data) => {
    try {
      console.log('Saving gallery item:', data);
      setEditingItem(null);
      await fetchData('/cloudinary/gallery', 'gallery');
      toast.success('Gallery item saved successfully');
    } catch (error) {
      console.error('Save gallery error:', error);
      toast.error(`Failed to save gallery item: ${error.response?.data?.error || error.message}`);
    }
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="comprehensive-admin">
      <div className="admin-header">
        <div className="admin-nav">
          <div className="admin-logo">
            <img src="/images/logo.jpeg" alt="Logo" />
            <h1>Sarbo Shakti Admin</h1>
          </div>
          <div className="admin-user">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d2691e, #8b4513)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>
                A
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#1e293b' }}>Welcome, Admin</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Super Administrator</div>
              </div>
            </div>
            <button onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/admin/login';
            }} className="btn-logout">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-menu">
            {[
              { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
              { id: 'members', icon: 'fas fa-users', label: 'Members' },
              { id: 'donations', icon: 'fas fa-donate', label: 'Donations' },
              { id: 'team', icon: 'fas fa-user-tie', label: 'Team' },
              { id: 'events', icon: 'fas fa-calendar', label: 'Events' },
              { id: 'activities', icon: 'fas fa-newspaper', label: 'Activities' },
              { id: 'gallery', icon: 'fas fa-images', label: 'Gallery' },
              { id: 'contacts', icon: 'fas fa-envelope', label: 'Messages' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'members' && renderMembersManagement()}
          {activeTab === 'donations' && (() => {
            const paginatedDonations = data.donations.slice(0, donationsPage * itemsPerPage);
            const hasMore = data.donations.length > paginatedDonations.length;

            return (
              <motion.div className="admin-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="section-header">
                  <h2><i className="fas fa-donate"></i> Donations Management</h2>
                </div>
                <div className="enhanced-table large">
                  <table>
                    <thead>
                      <tr>
                        <th>Donor</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Amount</th>
                        <th>Purpose</th>
                        <th>Payment</th>
                        <th>Screenshot</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedDonations.map((donation, index) => (
                        <motion.tr key={donation._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                          <td>{donation.donorName}</td>
                          <td>{donation.email}</td>
                          <td>{donation.phone}</td>
                          <td>₹{donation.amount}</td>
                          <td>{donation.purpose}</td>
                          <td>
                            <select
                              value={donation.paymentStatus || 'pending'}
                              onChange={async (e) => {
                                try {
                                  const next = e.target.value;
                                  await api.put(`/admin/donations/${donation._id}`, { payment_status: next });
                                  toast.success('Donation payment updated');
                                  await fetchData('/admin/donations', 'donations');
                                } catch (err) {
                                  toast.error(err.response?.data?.error || 'Failed to update payment');
                                }
                              }}
                              style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                            >
                              <option value="pending">pending</option>
                              <option value="completed">completed</option>
                              <option value="failed">failed</option>
                            </select>
                          </td>
                          <td>
                            {donation.paymentScreenshot ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img
                                  src={`${API_BASE_URL}/${String(donation.paymentScreenshot).replace(/^\/*/, '')}`}
                                  alt="Payment"
                                  style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: '1px solid #e2e8f0' }}
                                  onClick={() => setEditingItem({ type: 'donation', data: donation })}
                                />
                                <button className="btn-icon" title="Open" onClick={() => window.open(`${API_BASE_URL}/${String(donation.paymentScreenshot).replace(/^\/*/, '')}`, '_blank')}>
                                  <i className="fas fa-external-link-alt"></i>
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: '#9ca3af' }}>None</span>
                            )}
                          </td>
                          <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => sendDonationReceipt(donation)}
                                className="btn-icon"
                                style={{ background: '#28a745', color: 'white' }}
                                title="Send Receipt Email"
                              >
                                <i className="fas fa-envelope"></i>
                              </button>
                              <button onClick={() => deleteItem('donations', donation._id)} className="btn-icon btn-delete">
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {hasMore && (
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                      onClick={() => setDonationsPage(donationsPage + 1)}
                      className="btn-primary"
                      style={{ minWidth: '200px' }}
                    >
                      <i className="fas fa-chevron-down"></i> Show More ({data.donations.length - paginatedDonations.length} more)
                    </button>
                  </div>
                )}

                {editingItem?.type === 'donation' && (
                  <DonationScreenshotModal donation={editingItem.data} onClose={() => setEditingItem(null)} />
                )}
              </motion.div>
            );
          })()}
          {activeTab === 'team' && renderTeamManagement()}
          {activeTab === 'events' && renderEventsManagement()}
          {activeTab === 'activities' && renderActivitiesManagement()}
          {activeTab === 'gallery' && renderGalleryManagement()}
          {activeTab === 'contacts' && renderContactsManagement()}
        </div>
      </div>

      <style>{`
        .comprehensive-admin {
          min-height: 100vh;
          background: linear-gradient(135deg, #8b4513 0%, #d2691e 60%, #ffb74d 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
        }
        .comprehensive-admin::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="%23ffffff" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
          z-index: 0;
        }
        .enhanced-table::-webkit-scrollbar {
          height: 8px;
        }
        .enhanced-table::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
          border-radius: 10px;
        }
        .enhanced-table::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #d2691e, #8b4513);
          border-radius: 10px;
        }
        .enhanced-table::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #8b4513, #d2691e);
        }
        .admin-header {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(25px);
          color: #1a202c;
          padding: 1.5rem 0;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          position: relative;
          z-index: 1000;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .admin-nav {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .admin-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .admin-logo img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid #d2691e;
          box-shadow: 0 4px 15px rgba(210, 105, 30, 0.3);
        }
        .admin-logo h1 {
          background: linear-gradient(135deg, #d2691e, #8b4513);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          margin: 0;
          font-size: 1.5rem;
        }
        .admin-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .btn-logout {
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
        }
        .admin-container {
          max-width: 1600px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 3rem;
          padding: 3rem;
          position: relative;
          z-index: 1;
        }
        .admin-sidebar {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(25px);
          border-radius: 24px;
          padding: 2.5rem;
          height: fit-content;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          position: sticky;
          top: 2rem;
        }
        .admin-menu {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }
        .menu-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #d2691e, #8b4513);
          transition: left 0.3s ease;
          z-index: -1;
        }
        .menu-item:hover::before, .menu-item.active::before {
          left: 0;
        }
        .menu-item:hover, .menu-item.active {
          color: white;
          transform: translateX(5px);
        }
        .admin-content {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(25px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          position: relative;
          z-index: 1;
          overflow-x: hidden;
          max-width: 100%;
        }
        .dashboard-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(25px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          gap: 2rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.4);
        }
        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #d2691e, #8b4513);
          border-radius: 24px 24px 0 0;
        }
        .stat-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          transform: rotate(45deg);
          transition: all 0.6s ease;
          opacity: 0;
        }
        .stat-card:hover::after {
          opacity: 1;
          animation: shimmer 1.5s ease-in-out;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        .stat-icon {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.8rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .stat-content h3 {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0.5rem 0;
          line-height: 1;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }
        .section-header h2 {
          margin: 0;
          color: #1e293b;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .table-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          max-width: 100%;
        }
        .search-filter {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .search-box {
          position: relative;
          flex: 1;
          min-width: 300px;
        }
        .search-box i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }
        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .search-box input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .enhanced-table {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 20px;
          overflow-x: auto;
          overflow-y: visible;
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
          max-width: 100%;
          -webkit-overflow-scrolling: touch;
        }
        .enhanced-table table {
          width: 100%;
          min-width: 1000px;
          border-collapse: collapse;
        }
        .enhanced-table th {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          padding: 1.25rem 1rem;
          text-align: left;
          font-weight: 700;
          color: #1e293b;
          border-bottom: 2px solid #e2e8f0;
          font-size: 1rem;
          white-space: nowrap;
        }
        .enhanced-table td {
          padding: 1rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
          font-size: 0.95rem;
          white-space: nowrap;
        }
        .enhanced-table.large td, .enhanced-table.large th {
          font-size: 1.05rem;
        }
        .enhanced-table tr:hover {
          background: #f8fafc;
        }
        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .status-badge.approved {
          background: #dcfce7;
          color: #166534;
        }
        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }
        .status-badge.rejected {
          background: #fef2f2;
          color: #dc2626;
        }
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .btn-icon {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-icon::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transition: all 0.3s ease;
          transform: translate(-50%, -50%);
        }
        .btn-icon:hover::before {
          width: 100%;
          height: 100%;
        }
        .btn-icon.btn-delete {
          background: #fef2f2;
          color: #dc2626;
        }
        .btn-icon:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        }
        .admin-section {
          padding: 2rem;
        }
        .admin-section h2 {
          color: #1e293b;
          margin-bottom: 1rem;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }
        .gallery-item {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }
        .gallery-item:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .gallery-info {
          padding: 1rem;
        }
        .gallery-info h4 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
        }
        .gallery-info p {
          margin: 0 0 1rem 0;
          color: #64748b;
          font-size: 0.9rem;
        }
        .gallery-actions {
          display: flex;
          gap: 0.5rem;
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        .event-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }
        .event-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .event-header h4 {
          margin: 0;
          color: #1e293b;
        }
        .event-details {
          display: flex;
          gap: 1rem;
          margin: 1rem 0;
        }
        .event-details small {
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .event-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(25px);
          border-radius: 24px;
          padding: 3rem;
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.3);
          position: relative;
        }
        .modal::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          border-radius: 24px;
          pointer-events: none;
        }
        .modal h3 {
          margin: 0 0 1.5rem 0;
          color: #1e293b;
        }
        .team-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 16px;
          padding: 1.25rem;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }
        .team-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .team-card h4 {
          margin: 0.75rem 0 0.25rem 0;
          color: #1e293b;
          font-size: 1rem;
        }
        .team-card p {
          margin: 0 0 0.75rem 0;
          color: #64748b;
          font-size: 0.85rem;
        }
        .team-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 0.5rem;
        }
        .contacts-list {
          display: grid;
          gap: 1.5rem;
        }
        .contact-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .contact-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
        .contact-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .contact-header h4 {
          margin: 0;
          color: #1e293b;
        }
        .contact-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .btn-primary {
          background: linear-gradient(135deg, #d2691e 0%, #8b4513 100%);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(210, 105, 30, 0.4);
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .btn-primary:hover::before {
          left: 100%;
        }
        .btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 25px rgba(210, 105, 30, 0.6);
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #64748b;
          border: 2px solid rgba(100, 116, 139, 0.2);
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }
        .btn-secondary:hover {
          background: rgba(100, 116, 139, 0.1);
          border-color: rgba(100, 116, 139, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(100, 116, 139, 0.2);
        }
        .section-header {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .admin-logo img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid #d2691e;
          box-shadow: 0 5px 15px rgba(210, 105, 30, 0.3);
        }
        .menu-item {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          margin-bottom: 0.5rem;
        }
        .menu-item.active {
          background: linear-gradient(135deg, #d2691e 0%, #8b4513 100%);
          box-shadow: 0 5px 15px rgba(210, 105, 30, 0.35);
        }
        .search-box input {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(226, 232, 240, 0.5);
        }
        .search-box input:focus {
          background: rgba(255, 255, 255, 0.95);
          border-color: #d2691e;
          box-shadow: 0 0 0 4px rgba(210, 105, 30, 0.12);
        }
        .enhanced-table th {
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(226, 232, 240, 0.9));
          backdrop-filter: blur(10px);
        }
        .enhanced-table tr:hover {
          background: rgba(255, 215, 0, 0.08);
          transform: scale(1.01);
          transition: all 0.2s ease;
        }
        @media (max-width: 768px) {
          .admin-container {
            grid-template-columns: 1fr;
            padding: 1.5rem;
            gap: 2rem;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .search-filter {
            flex-direction: column;
            align-items: stretch;
          }
          .search-box {
            min-width: auto;
          }
          .admin-content {
            padding: 1.5rem;
            overflow-x: hidden;
          }
          .modal {
            padding: 2rem;
            width: 95%;
          }
          .enhanced-table {
            border-radius: 12px;
          }
          .enhanced-table table {
            min-width: 800px;
          }
          .enhanced-table th,
          .enhanced-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.85rem;
          }
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }
        .modal {
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          max-width: 900px;
          width: 100%;
          padding: 1.5rem;
        }
        .modal.large {
          max-width: 1200px;
        }
      `}</style>
    </div>
  );
};

const GalleryForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: data.title || '',
    description: data.description || '',
    image: data.image || data.file || '',
    type: data.type || 'photo',
    category: data.category || 'general',
    featured: data.featured || false
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: previewUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!selectedFile && !data._id) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = formData.image;

      // Upload file if new file is selected
      if (selectedFile) {
        const uploadData = new FormData();

        // Use Cloudinary upload endpoint
        if (formData.type === 'video') {
          uploadData.append('video', selectedFile);
        } else {
          uploadData.append('image', selectedFile);
        }
        uploadData.append('title', formData.title);
        uploadData.append('description', formData.description);
        uploadData.append('category', formData.category);
        uploadData.append('featured', formData.featured);

        const uploadEndpoint = formData.type === 'video' ? '/cloudinary/video' : '/cloudinary/gallery';

        const response = await api.post(uploadEndpoint, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const result = response.data;
        if (result?.success) {
          toast.success(`${formData.type === 'video' ? 'Video' : 'Image'} uploaded successfully!`);
          onSave(result.data);
          return;
        } else {
          throw new Error(result?.message || 'Upload failed');
        }
      } else {
        // Update existing item without file change
        onSave({ ...data, ...formData });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        placeholder="Title *"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', minHeight: '100px' }}
      />

      <select
        value={formData.category}
        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      >
        <option value="general">General</option>
        <option value="events">Events</option>
        <option value="activities">Activities</option>
        <option value="achievements">Achievements</option>
        <option value="temple">Temple</option>
        <option value="festival">Festival</option>
        <option value="featured">Featured</option>
      </select>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
        />
        <label htmlFor="featured" style={{ fontWeight: '600', color: '#333' }}>Featured Item</label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontWeight: '600', color: '#333' }}>
          {formData.type === 'video' ? 'Select Video File *' : 'Select Image File *'}
        </label>
        <input
          type="file"
          accept={formData.type === 'video' ? 'video/*' : 'image/*'}
          onChange={handleFileSelect}
          required={!data._id}
          style={{
            padding: '12px',
            border: '2px dashed #d2691e',
            borderRadius: '8px',
            cursor: 'pointer',
            background: '#fafbfc'
          }}
        />
      </div>

      {uploading && <p style={{ color: '#666', textAlign: 'center' }}>Uploading...</p>}

      {formData.image && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Preview:</p>
          {formData.type === 'video' ? (
            <video
              src={formData.image}
              style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }}
              controls
            />
          ) : (
            <img
              src={formData.image.startsWith('blob:') ? formData.image : (formData.image.startsWith('http') ? formData.image : `${API_BASE_URL}${formData.image}`)}
              alt="Preview"
              style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }}
            />
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.75rem 1.5rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            background: 'white',
            color: '#64748b',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '0.75rem 1.5rem',
            background: uploading ? '#ccc' : 'linear-gradient(135deg, #d2691e, #ff8c00)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          {uploading ? 'Uploading...' : (data._id ? 'Update' : 'Upload')}
        </button>
      </div>
    </form>
  );
};

const TeamForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: data.name || '',
    position: data.position || data.designation || '',
    category: data.category || 'core_member',
    bio: data.bio || '',
    email: data.email || '',
    phone: data.phone || '',
    photo: data.photo || data.photo_url || '',
    showInTeam: data.showInTeam !== undefined ? data.showInTeam : (data.is_active !== undefined ? data.is_active : true)
  });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(data.photo || data.photo_url || '');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create immediate preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);
    uploadData.append('title', `Team Member - ${formData.name || 'Photo'}`);
    uploadData.append('category', 'team');

    try {
      const response = await api.post('/cloudinary/gallery', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const result = response.data;
      if (result?.success) {
        const imageUrl = result.data.image_url;
        setFormData(prev => ({ ...prev, photo: imageUrl }));
        setPreview(imageUrl);
        // Clean up blob URL
        URL.revokeObjectURL(previewUrl);
        toast.success('Team member photo uploaded to Cloudinary!');
      } else {
        throw new Error(result?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image: ' + (error.response?.data?.error || error.message));
      // Revert preview on error
      setPreview(data.photo || data.photo_url || '');
      URL.revokeObjectURL(previewUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }



    // Map form data to backend expectations
    const finalData = {
      ...data,
      name: formData.name,
      designation: formData.position,
      bio: formData.bio || '',
      email: formData.email || '',
      phone: formData.phone || '',
      photo_url: formData.photo || data.photo_url || '',
      is_active: formData.showInTeam
    };

    if (formData.category) {
      finalData.category = formData.category;
    }

    onSave(finalData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      />

      <select
        value={formData.category}
        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      >
        <option value="founder">Founder</option>
        <option value="trustee">Trustee</option>
        <option value="core_member">Core Member</option>
        <option value="volunteer">Volunteer</option>
      </select>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontWeight: '600', color: '#333' }}>Team Member Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          style={{
            padding: '12px',
            border: '2px dashed #d2691e',
            borderRadius: '8px',
            cursor: 'pointer',
            background: '#fafbfc'
          }}
        />
        {uploading && <p style={{ color: '#666', margin: 0 }}>Uploading...</p>}
        {preview && (
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <img
              src={preview.startsWith('http') || preview.startsWith('blob:') ? preview : `${API_BASE_URL}/${preview.replace(/^\/*/, '')}`}
              alt="Preview"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #d2691e'
              }}
            />
          </div>
        )}
      </div>
      <textarea
        placeholder="Biography"
        value={formData.bio}
        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', minHeight: '100px' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem' }}>
        <input
          type="checkbox"
          id="showInTeam"
          checked={formData.showInTeam}
          onChange={(e) => setFormData(prev => ({ ...prev, showInTeam: e.target.checked }))}
          style={{ width: 'auto' }}
        />
        <label htmlFor="showInTeam" style={{ fontWeight: '600', color: '#333', cursor: 'pointer' }}>
          Show in Team Section
        </label>
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">Save</button>
      </div>
    </form>
  );
};

const ActivityForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: data.title || '',
    description: data.description || '',
    category: data.category || 'event',
    is_active: data.is_active !== undefined ? data.is_active : true,
    image_url: data.image_url || data.image || ''
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image_url: previewUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    let finalData = { ...data };

    // Upload image if selected
    if (selectedFile) {
      setUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('image', selectedFile);
        uploadData.append('title', `Activity - ${formData.title}`);
        uploadData.append('category', 'activities');

        const response = await api.post('/cloudinary/gallery', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const result = response.data;
        if (result?.success) {
          finalData.image_url = result.data.image_url;
          console.log('Cloudinary upload success:', result.data.image_url);
          // Clean up blob URL
          if (formData.image_url && formData.image_url.startsWith('blob:')) {
            URL.revokeObjectURL(formData.image_url);
          }
        } else {
          throw new Error(result?.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error('Failed to upload image: ' + (error.response?.data?.error || error.message));
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    } else if (formData.image_url && !formData.image_url.startsWith('blob:')) {
      // Use existing image URL
      finalData.image_url = formData.image_url;
    } else {
      // No image provided
      finalData.image_url = null;
    }

    // Map form data to backend expectations
    finalData.title = formData.title;
    finalData.description = formData.description;
    finalData.category = formData.category;
    finalData.is_active = formData.is_active;

    onSave(finalData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        placeholder="Activity Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      />
      <textarea
        placeholder="Activity Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        required
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', minHeight: '100px' }}
      />
      <select
        value={formData.category}
        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      >
        <option value="event">Event</option>
        <option value="service">Service</option>
        <option value="achievement">Achievement</option>
        <option value="announcement">Announcement</option>
        <option value="donation">Donation</option>
        <option value="education">Education</option>
        <option value="healthcare">Healthcare</option>
        <option value="cultural">Cultural</option>
      </select>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontWeight: '600', color: '#333' }}>Activity Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{
            padding: '12px',
            border: '2px dashed #d2691e',
            borderRadius: '8px',
            cursor: 'pointer',
            background: '#fafbfc'
          }}
        />
        {formData.image_url && (
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <img
              src={formData.image_url.startsWith('blob:') ? formData.image_url : (formData.image_url.startsWith('http') ? formData.image_url : `${API_BASE_URL}${formData.image_url}`)}
              alt="Preview"
              style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
        />
        <label htmlFor="is_active">Active (Visible on website)</label>
      </div>
      {uploading && <p style={{ color: '#666', textAlign: 'center' }}>Uploading image...</p>}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={uploading} className="btn-primary">
          {uploading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

const EventForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: data.title || '',
    description: data.description || '',
    location: data.location || data.venue || '',
    event_date: data.event_date || (data.eventDate ? new Date(data.eventDate).toISOString().split('T')[0] : ''),
    status: data.status || 'upcoming',
    category: data.category || '',
    image_url: data.image_url || data.image || ''
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image_url: previewUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.event_date) {
      toast.error('Please select an event date');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Please enter a location');
      return;
    }

    let finalData = { ...data };

    // Upload image if selected
    if (selectedFile) {
      setUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('image', selectedFile);
        uploadData.append('title', `Event - ${formData.title}`);
        uploadData.append('category', 'events');

        const response = await api.post('/cloudinary/gallery', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const result = response.data;
        if (result?.success) {
          finalData.image_url = result.data.image_url;
        } else {
          throw new Error(result?.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error('Failed to upload image: ' + (error.response?.data?.error || error.message));
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    } else if (formData.image_url && !formData.image_url.startsWith('blob:')) {
      // Use existing image URL
      finalData.image_url = formData.image_url;
    }

    // Map form data to backend expectations
    finalData.title = formData.title;
    finalData.description = formData.description;
    finalData.location = formData.location;
    finalData.event_date = formData.event_date;
    finalData.status = formData.status;
    if (formData.category) {
      finalData.category = formData.category;
    }

    onSave(finalData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        placeholder="Event Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      />
      <textarea
        placeholder="Event Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        required
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', minHeight: '100px' }}
      />
      <input
        type="text"
        placeholder="Location/Venue *"
        value={formData.location}
        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
        required
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      />
      <input
        type="date"
        value={formData.event_date}
        onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
        required
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      />
      <select
        value={formData.status}
        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      >
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input
        type="text"
        placeholder="Category (optional)"
        value={formData.category}
        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        style={{ padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontWeight: '600', color: '#333' }}>Event Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{
            padding: '12px',
            border: '2px dashed #d2691e',
            borderRadius: '8px',
            cursor: 'pointer',
            background: '#fafbfc'
          }}
        />
        {formData.image_url && (
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <img
              src={formData.image_url.startsWith('blob:') ? formData.image_url : (formData.image_url.startsWith('http') ? formData.image_url : `${API_BASE_URL}${formData.image_url}`)}
              alt="Preview"
              style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </div>
        )}
      </div>
      {uploading && <p style={{ color: '#666', textAlign: 'center' }}>Uploading image...</p>}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={uploading} className="btn-primary">
          {uploading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ComprehensiveAdminDashboard;
