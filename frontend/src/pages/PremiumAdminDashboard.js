import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const PremiumAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [members, setMembers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [donations, setDonations] = useState([]);
  const [team, setTeam] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/members/list');
      setMembers(response.data.members || []);
    } catch (error) {
      toast.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/team');
      setTeam(response.data.team || []);
    } catch (error) {
      toast.error('Failed to fetch team');
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/gallery');
      setGallery(response.data.images || []);
    } catch (error) {
      toast.error('Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/events');
      setEvents(response.data.events || []);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const approveMember = async (id) => {
    try {
      await api.put(`/members/approve/${id}`);
      toast.success('Member approved successfully');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to approve member');
    }
  };

  const rejectMember = async (id, reason) => {
    try {
      await api.put(`/members/reject/${id}`, { reason });
      toast.success('Member rejected');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to reject member');
    }
  };

  const addTeamMember = async (data) => {
    try {
      await api.post('/admin/team', data);
      toast.success('Team member added');
      fetchTeam();
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to add team member');
    }
  };

  const updateTeamMember = async (id, data) => {
    try {
      await api.put(`/admin/team/${id}`, data);
      toast.success('Team member updated');
      fetchTeam();
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update team member');
    }
  };

  const deleteTeamMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await api.delete(`/admin/team/${id}`);
        toast.success('Team member deleted');
        fetchTeam();
      } catch (error) {
        toast.error('Failed to delete team member');
      }
    }
  };

  const addGalleryImage = async (data) => {
    try {
      await api.post('/admin/gallery', data);
      toast.success('Image added to gallery');
      fetchGallery();
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to add image');
    }
  };

  const deleteGalleryImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await api.delete(`/admin/gallery/${id}`);
        toast.success('Image deleted');
        fetchGallery();
      } catch (error) {
        toast.error('Failed to delete image');
      }
    }
  };

  const addEvent = async (data) => {
    try {
      await api.post('/admin/events', data);
      toast.success('Event added');
      fetchEvents();
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to add event');
    }
  };

  const deleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/admin/events/${id}`);
        toast.success('Event deleted');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEditingItem(null);
    if (tab === 'members') fetchMembers();
    if (tab === 'team') fetchTeam();
    if (tab === 'gallery') fetchGallery();
    if (tab === 'events') fetchEvents();
  };

  const renderDashboard = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-users"></i></div>
          <div className="stat-content">
            <h3>Total Members</h3>
            <p className="stat-number">{stats.totalMembers || 0}</p>
            <small>Active: {stats.activeMembers || 0}</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-rupee-sign"></i></div>
          <div className="stat-content">
            <h3>Total Donations</h3>
            <p className="stat-number">₹{stats.totalDonations || 0}</p>
            <small>This month: ₹{stats.monthlyDonations || 0}</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-clock"></i></div>
          <div className="stat-content">
            <h3>Pending Approvals</h3>
            <p className="stat-number">{stats.pendingMembers || 0}</p>
            <small>Requires attention</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-envelope"></i></div>
          <div className="stat-content">
            <h3>Messages</h3>
            <p className="stat-number">{stats.totalContacts || 0}</p>
            <small>Unread: {stats.unreadContacts || 0}</small>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="admin-card">
          <h3>Recent Activities</h3>
          <div className="activity-list">
            <div className="activity-item">
              <i className="fas fa-user-plus"></i>
              <span>New member registration</span>
              <small>2 minutes ago</small>
            </div>
            <div className="activity-item">
              <i className="fas fa-donate"></i>
              <span>New donation received</span>
              <small>15 minutes ago</small>
            </div>
            <div className="activity-item">
              <i className="fas fa-envelope"></i>
              <span>Contact form submitted</span>
              <small>1 hour ago</small>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button onClick={() => setActiveTab('members')} className="action-btn">
              <i className="fas fa-users"></i> Manage Members
            </button>
            <button onClick={() => setActiveTab('team')} className="action-btn">
              <i className="fas fa-user-tie"></i> Manage Team
            </button>
            <button onClick={() => setActiveTab('gallery')} className="action-btn">
              <i className="fas fa-images"></i> Update Gallery
            </button>
            <button onClick={() => setActiveTab('events')} className="action-btn">
              <i className="fas fa-calendar"></i> Add Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Members Management</h2>
        <div>
          <button onClick={() => fetchMembers()} className="btn-secondary">
            <i className="fas fa-sync"></i> Refresh
          </button>
        </div>
      </div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member._id}>
                  <td>{member.memberId}</td>
                  <td>{member.fullName}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td><span className="plan-badge">{member.membershipPlan}</span></td>
                  <td><span className={`status-badge ${member.status}`}>{member.status}</span></td>
                  <td>
                    {member.status === 'pending' && (
                      <>
                        <button onClick={() => approveMember(member._id)} className="btn-approve">
                          <i className="fas fa-check"></i>
                        </button>
                        <button onClick={() => rejectMember(member._id, 'Admin rejected')} className="btn-reject">
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    )}
                    <button className="btn-view">
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderTeam = () => (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Team Management</h2>
        <button onClick={() => setEditingItem({ type: 'team', data: {} })} className="btn-primary">
          <i className="fas fa-plus"></i> Add Member
        </button>
      </div>
      
      {editingItem?.type === 'team' && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingItem.data._id ? 'Edit' : 'Add'} Team Member</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData);
              if (editingItem.data._id) {
                updateTeamMember(editingItem.data._id, data);
              } else {
                addTeamMember(data);
              }
            }}>
              <input name="name" placeholder="Full Name" defaultValue={editingItem.data.name} required />
              <input name="position" placeholder="Position" defaultValue={editingItem.data.position} required />
              <textarea name="bio" placeholder="Biography" defaultValue={editingItem.data.bio}></textarea>
              <input name="email" type="email" placeholder="Email" defaultValue={editingItem.data.email} />
              <input name="phone" placeholder="Phone" defaultValue={editingItem.data.phone} />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="team-grid">
        {team.map(member => (
          <div key={member._id} className="team-card">
            <div className="team-photo">
              <img src={member.photo || '/images/default-avatar.png'} alt={member.name} />
            </div>
            <h4>{member.name}</h4>
            <p className="position">{member.position}</p>
            <div className="team-actions">
              <button onClick={() => setEditingItem({ type: 'team', data: member })} className="btn-edit">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => deleteTeamMember(member._id)} className="btn-delete">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="premium-admin">
      <div className="admin-header">
        <div className="admin-nav">
          <div className="admin-logo">
            <img src="/images/logo.jpeg" alt="Logo" />
            <h1>Sarbo Shakti Admin</h1>
          </div>
          <div className="admin-user">
            <span>Welcome, Admin</span>
            <button onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/admin/login';
            }} className="btn-logout">
              <i className="fas fa-sign-out-alt"></i>
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
              { id: 'contacts', icon: 'fas fa-envelope', label: 'Messages' },
              { id: 'team', icon: 'fas fa-user-tie', label: 'Team' },
              { id: 'gallery', icon: 'fas fa-images', label: 'Gallery' },
              { id: 'events', icon: 'fas fa-calendar', label: 'Events' },
              { id: 'settings', icon: 'fas fa-cog', label: 'Settings' }
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
          {activeTab === 'members' && renderMembers()}
          {activeTab === 'team' && renderTeam()}
        </div>
      </div>

      <style jsx>{`
        .premium-admin {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .admin-header {
          background: linear-gradient(135deg, #8b4513, #d2691e);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
        }
        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
          padding: 2rem;
        }
        .admin-sidebar {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          height: fit-content;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
          padding: 1rem;
          border: none;
          background: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
        }
        .menu-item:hover, .menu-item.active {
          background: linear-gradient(135deg, #d2691e, #ff8c00);
          color: white;
        }
        .admin-content {
          background: white;
          border-radius: 10px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .admin-card {
          background: white;
          border-radius: 10px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: transform 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
        }
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d2691e, #ff8c00);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }
        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #d2691e;
          margin: 0.5rem 0;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        .admin-table th,
        .admin-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .admin-table th {
          background: #f8f9fa;
          font-weight: 600;
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }
        .status-badge.approved {
          background: #d4edda;
          color: #155724;
        }
        .btn-approve, .btn-reject, .btn-view, .btn-edit, .btn-delete {
          padding: 0.5rem;
          margin: 0 0.25rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .btn-approve { background: #28a745; color: white; }
        .btn-reject { background: #dc3545; color: white; }
        .btn-view { background: #17a2b8; color: white; }
        .btn-edit { background: #ffc107; color: #212529; }
        .btn-delete { background: #dc3545; color: white; }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          border-radius: 10px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
        }
        .modal input, .modal textarea {
          width: 100%;
          padding: 0.75rem;
          margin: 0.5rem 0;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }
        .team-card {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
        }
        .team-photo img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default PremiumAdminDashboard;