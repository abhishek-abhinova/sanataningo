import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [members, setMembers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
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

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contact');
      setContacts(response.data.contacts || []);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/donations/list');
      setDonations(response.data.donations || []);
    } catch (error) {
      toast.error('Failed to fetch donations');
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'members') fetchMembers();
    if (tab === 'contacts') fetchContacts();
    if (tab === 'donations') fetchDonations();
  };

  return (
    <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#8b4513', marginBottom: '2rem' }}>Admin Dashboard</h1>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #ddd' }}>
          {['dashboard', 'members', 'contacts', 'donations'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                background: activeTab === tab ? '#d2691e' : 'transparent',
                color: activeTab === tab ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0',
                textTransform: 'capitalize',
                fontWeight: '600'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Stats */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#d2691e' }}>Total Members</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{stats.totalMembers || 0}</p>
            </div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#d2691e' }}>Total Donations</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>₹{stats.totalDonations || 0}</p>
            </div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#d2691e' }}>Pending Members</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{stats.pendingMembers || 0}</p>
            </div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#d2691e' }}>Contact Messages</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{stats.totalContacts || 0}</p>
            </div>
          </div>
        )}

        {/* Members Management */}
        {activeTab === 'members' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#8b4513', marginBottom: '1rem' }}>Members Management</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Phone</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Plan</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member._id}>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{member.fullName}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{member.email}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{member.phone}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{member.membershipPlan}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            background: member.status === 'approved' ? '#d4edda' : member.status === 'pending' ? '#fff3cd' : '#f8d7da',
                            color: member.status === 'approved' ? '#155724' : member.status === 'pending' ? '#856404' : '#721c24'
                          }}>
                            {member.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                          {member.status === 'pending' && (
                            <>
                              <button
                                onClick={() => approveMember(member._id)}
                                style={{ padding: '0.5rem 1rem', marginRight: '0.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectMember(member._id, 'Admin rejected')}
                                style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Contacts Management */}
        {activeTab === 'contacts' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#8b4513', marginBottom: '1rem' }}>Contact Messages</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Subject</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Message</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(contact => (
                      <tr key={contact._id}>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{contact.name}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{contact.email}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{contact.subject}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.message}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{new Date(contact.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Donations Management */}
        {activeTab === 'donations' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#8b4513', marginBottom: '1rem' }}>Donations Management</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Amount</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Purpose</th>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(donation => (
                      <tr key={donation._id}>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{donation.fullName}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{donation.email}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>₹{donation.amount}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{donation.purpose || 'General'}</td>
                        <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{new Date(donation.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;