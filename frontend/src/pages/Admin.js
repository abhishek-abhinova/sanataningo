import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Configure axios base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '/api';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/admin/members');
      setMembers(response.data.members);
    } catch (error) {
      toast.error('Failed to fetch members');
    }
  };

  const verifyMember = async (memberId) => {
    setLoading(true);
    try {
      await axios.post(`/admin/members/${memberId}/verify`);
      toast.success('Member verified successfully!');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to verify member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '2rem' }}>👥 Member Management</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Type</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Reference</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{member.fullName}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{member.email}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {member.membershipType}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>₹{member.amount}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{member.paymentReference || 'N/A'}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ 
                    background: member.paymentStatus === 'completed' ? '#e8f5e8' : '#fff3cd', 
                    color: member.paymentStatus === 'completed' ? '#28a745' : '#856404',
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem' 
                  }}>
                    {member.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {member.paymentStatus === 'pending' && (
                    <button
                      onClick={() => verifyMember(member._id)}
                      disabled={loading}
                      style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('/admin/donations');
      setDonations(response.data.donations);
    } catch (error) {
      toast.error('Failed to fetch donations');
    }
  };

  const verifyDonation = async (donationId) => {
    setLoading(true);
    try {
      await axios.post(`/admin/donations/${donationId}/verify`);
      toast.success('Donation verified successfully!');
      fetchDonations();
    } catch (error) {
      toast.error('Failed to verify donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '2rem' }}>💰 Donation Management</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Donor</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Purpose</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Reference</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(donation => (
              <tr key={donation._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{donation.donorName}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{donation.email}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>₹{donation.amount}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ background: '#f3e5f5', color: '#7b1fa2', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {donation.purpose}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{donation.paymentReference || 'N/A'}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ 
                    background: donation.paymentStatus === 'completed' ? '#e8f5e8' : '#fff3cd', 
                    color: donation.paymentStatus === 'completed' ? '#28a745' : '#856404',
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem' 
                  }}>
                    {donation.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {donation.paymentStatus === 'pending' && (
                    <button
                      onClick={() => verifyDonation(donation._id)}
                      disabled={loading}
                      style={{ background: '#ff8c00', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
      fetchDashboardData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/auth/login', loginForm);
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setIsLoggedIn(true);
        toast.success('Login successful!');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setDashboardData(null);
    toast.success('Logged out successfully!');
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a202c, #2d3748)', marginTop: '90px' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', maxWidth: '400px', width: '100%' }}>
          <h2 style={{ textAlign: 'center', color: '#1a202c', marginBottom: '2rem' }}>🔐 Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '1rem' }}
                required
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '1rem' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #d2691e, #ff8c00)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '90px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', color: 'white', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>🛡️ Admin Dashboard</h1>
          <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['dashboard', 'members', 'donations', 'contacts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === tab ? 'linear-gradient(135deg, #d2691e, #ff8c00)' : '#e9ecef',
                color: activeTab === tab ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && dashboardData && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', color: '#28a745', marginBottom: '1rem' }}>👥</div>
                <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Total Members</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745', margin: 0 }}>{dashboardData.stats.totalMembers}</p>
              </div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', color: '#ff8c00', marginBottom: '1rem' }}>💰</div>
                <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Total Donations</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff8c00', margin: 0 }}>₹{dashboardData.stats.totalAmount}</p>
              </div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', color: '#6f42c1', marginBottom: '1rem' }}>📧</div>
                <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Pending Contacts</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6f42c1', margin: 0 }}>{dashboardData.stats.pendingContacts}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#333', marginBottom: '1.5rem' }}>Recent Members</h3>
                {dashboardData.recentMembers.map(member => (
                  <div key={member._id} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{member.fullName}</strong><br />
                      <small style={{ color: '#666' }}>{member.email}</small>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {member.membershipType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#333', marginBottom: '1.5rem' }}>Recent Donations</h3>
                {dashboardData.recentDonations.map(donation => (
                  <div key={donation._id} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{donation.donorName}</strong><br />
                      <small style={{ color: '#666' }}>{donation.purpose}</small>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ color: '#28a745' }}>₹{donation.amount}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && <MemberManagement />}
        {activeTab === 'donations' && <DonationManagement />}
        {activeTab === 'contacts' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3>📧 Contact Management</h3>
            <p style={{ color: '#666' }}>Contact management interface will be implemented here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;