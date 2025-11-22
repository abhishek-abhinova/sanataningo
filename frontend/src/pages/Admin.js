import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members/list?status=pending');
      setMembers(response.data.members);
    } catch (error) {
      toast.error('Failed to fetch members');
    }
  };

  const approveMember = async (memberId) => {
    setLoading(true);
    try {
      await api.put(`/members/approve/${memberId}`);
      toast.success('Member approved successfully!');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to approve member');
    } finally {
      setLoading(false);
    }
  };

  const rejectMember = async (memberId, reason) => {
    setLoading(true);
    try {
      await api.put(`/members/reject/${memberId}`, { reason });
      toast.success('Member rejected');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to reject member');
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
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Member</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Phone</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Plan</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>UPI Ref</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <div>
                    <strong>{member.fullName}</strong><br/>
                    <small>{member.email}</small>
                  </div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{member.phone}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {member.membershipPlan}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>₹{member.amount}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{member.upiReference || 'N/A'}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ 
                    background: member.status === 'approved' ? '#e8f5e8' : '#fff3cd', 
                    color: member.status === 'approved' ? '#28a745' : '#856404',
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem' 
                  }}>
                    {member.status}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {member.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => approveMember(member._id)}
                        disabled={loading}
                        style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Rejection reason:');
                          if (reason) rejectMember(member._id, reason);
                        }}
                        disabled={loading}
                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Reject
                      </button>
                    </div>
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
      const response = await api.get('/donations?status=pending');
      setDonations(response.data.donations);
    } catch (error) {
      toast.error('Failed to fetch donations');
    }
  };

  const approveDonation = async (donationId) => {
    setLoading(true);
    try {
      await api.put(`/donations/${donationId}/approve`);
      toast.success('Donation approved and receipt sent!');
      fetchDonations();
    } catch (error) {
      toast.error('Failed to approve donation');
    } finally {
      setLoading(false);
    }
  };

  const rejectDonation = async (donationId, reason) => {
    setLoading(true);
    try {
      await api.put(`/donations/${donationId}/reject`, { reason });
      toast.success('Donation rejected');
      fetchDonations();
    } catch (error) {
      toast.error('Failed to reject donation');
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
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Purpose</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>UPI Ref</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Screenshot</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(donation => (
              <tr key={donation._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <div>
                    <strong>{donation.donorName}</strong><br/>
                    <small>{donation.email}</small>
                  </div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>₹{donation.amount}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{donation.purpose}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{donation.paymentReference}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {donation.paymentScreenshot && (
                    <a href={`/${donation.paymentScreenshot}`} target="_blank" rel="noopener noreferrer" 
                       style={{ color: '#007bff', textDecoration: 'none' }}>View</a>
                  )}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ 
                    background: donation.paymentStatus === 'approved' ? '#e8f5e8' : '#fff3cd', 
                    color: donation.paymentStatus === 'approved' ? '#28a745' : '#856404',
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem' 
                  }}>
                    {donation.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {donation.paymentStatus === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => approveDonation(donation._id)}
                        disabled={loading}
                        style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Rejection reason:');
                          if (reason) rejectDonation(donation._id, reason);
                        }}
                        disabled={loading}
                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Reject
                      </button>
                    </div>
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

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contact');
      setContacts(response.data.contacts);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    }
  };

  const resolveContact = async (contactId) => {
    setLoading(true);
    try {
      await api.put(`/contact/${contactId}/resolve`);
      toast.success('Contact marked as resolved!');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to resolve contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '2rem' }}>📧 Contact Management</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Subject</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Message</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <div>
                    <strong>{contact.name}</strong><br/>
                    <small>{contact.phone || 'N/A'}</small>
                  </div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{contact.email}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{contact.subject}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {contact.message.substring(0, 100)}{contact.message.length > 100 ? '...' : ''}
                  </div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {new Date(contact.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ 
                    background: contact.status === 'resolved' ? '#e8f5e8' : '#fff3cd', 
                    color: contact.status === 'resolved' ? '#28a745' : '#856404',
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem' 
                  }}>
                    {contact.status}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {contact.status !== 'resolved' && (
                    <button
                      onClick={() => resolveContact(contact._id)}
                      disabled={loading}
                      style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Resolve
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

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/admin/transactions/pending');
      setTransactions(response.data.transactions);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    }
  };

  const approveTransaction = async (transactionId) => {
    setLoading(true);
    try {
      await api.put(`/admin/transactions/approve/${transactionId}`);
      toast.success('Transaction approved successfully!');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to approve transaction');
    } finally {
      setLoading(false);
    }
  };

  const rejectTransaction = async (transactionId, reason) => {
    setLoading(true);
    try {
      await api.put(`/admin/transactions/reject/${transactionId}`, { reason });
      toast.success('Transaction rejected');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to reject transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '2rem' }}>💳 UPI Transaction Verification</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Member</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>UPI Ref</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Screenshot</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <div>
                    <strong>{transaction.memberId?.fullName}</strong><br/>
                    <small>{transaction.memberId?.email}</small>
                  </div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>₹{transaction.amount}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{transaction.upiReference}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <a href={`/${transaction.paymentScreenshot}`} target="_blank" rel="noopener noreferrer" 
                     style={{ color: '#007bff', textDecoration: 'none' }}>View Screenshot</a>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => approveTransaction(transaction._id)}
                      disabled={loading}
                      style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Rejection reason:');
                        if (reason) rejectTransaction(transaction._id, reason);
                      }}
                      disabled={loading}
                      style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Reject
                    </button>
                  </div>
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
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token is still valid
      api.get('/auth/me')
        .then(() => {
          setIsLoggedIn(true);
          fetchDashboardData();
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', loginForm);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
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
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setDashboardData(null);
    setActiveTab('dashboard');
    toast.success('Logged out successfully!');
  };

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
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
          {['dashboard', 'members', 'donations', 'transactions', 'contacts'].map(tab => (
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#28a745', marginBottom: '0.5rem' }}>👥</div>
                <h4 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Total Registered</h4>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#28a745', margin: 0 }}>{dashboardData.stats?.totalRegistered || 0}</p>
              </div>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#007bff', marginBottom: '0.5rem' }}>✅</div>
                <h4 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Active Members</h4>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#007bff', margin: 0 }}>{dashboardData.stats?.activeMembers || 0}</p>
              </div>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#ffc107', marginBottom: '0.5rem' }}>⏳</div>
                <h4 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Pending</h4>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffc107', margin: 0 }}>{dashboardData.stats?.pendingMembers || 0}</p>
              </div>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#dc3545', marginBottom: '0.5rem' }}>❌</div>
                <h4 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rejected</h4>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#dc3545', margin: 0 }}>{dashboardData.stats?.rejectedMembers || 0}</p>
              </div>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#6c757d', marginBottom: '0.5rem' }}>⏰</div>
                <h4 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Expired</h4>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#6c757d', margin: 0 }}>{dashboardData.stats?.expiredMembers || 0}</p>
              </div>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#ff8c00', marginBottom: '0.5rem' }}>💰</div>
                <h4 style={{ color: '#333', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Today's Entries</h4>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ff8c00', margin: 0 }}>{dashboardData.stats?.todayRegistrations || 0}</p>
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
        {activeTab === 'transactions' && <TransactionManagement />}
        {activeTab === 'contacts' && <ContactManagement />}
      </div>
    </div>
  );
};

export default Admin;