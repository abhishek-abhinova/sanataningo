import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const MemberManagement = ({ onUpdate }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMembers();
  }, [filter]);

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/admin/members${filter !== 'all' ? `?status=${filter}` : ''}`);
      setMembers(response.data.members || []);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      setMembers([]);
    }
  };

  const approveMember = async (memberId) => {
    setLoading(true);
    try {
      await api.put(`/members/approve/${memberId}`);
      toast.success('✅ Member approved successfully!');
      fetchMembers();
      onUpdate && onUpdate(); // Update dashboard
    } catch (error) {
      toast.error('❌ Failed to approve member');
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

  const sendMembershipCard = async (memberId) => {
    setLoading(true);
    try {
      await api.post(`/members/${memberId}/send-card`);
      toast.success('Membership card sent successfully!');
    } catch (error) {
      toast.error('Failed to send membership card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>👥 Member Management</h2>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Manage member applications and approvals</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                background: filter === status ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                transition: 'all 0.3s ease'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '2rem' }}>
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
                  {member.status === 'pending' ? (
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
                  ) : member.status === 'approved' ? (
                    <button
                      onClick={() => sendMembershipCard(member._id)}
                      disabled={loading}
                      style={{ background: '#007bff', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Send ID Card
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

const DonationManagement = ({ onUpdate }) => {
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

  const sendThankYouEmail = async (donationId) => {
    setLoading(true);
    try {
      await api.post(`/donations/${donationId}/send-thank-you`);
      toast.success('Thank you email sent successfully!');
    } catch (error) {
      toast.error('Failed to send thank you email');
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
                  {donation.paymentStatus === 'pending' ? (
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
                  ) : (
                    <button
                      onClick={() => sendThankYouEmail(donation._id)}
                      disabled={loading}
                      style={{ background: '#007bff', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Send Thank You
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

const ContactManagement = ({ onUpdate }) => {
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

const TransactionManagement = ({ onUpdate }) => {
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

const GalleryManagement = ({ onUpdate }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'general', showOnHomepage: false });

  const fetchImages = async () => {
    try {
      const response = await api.get('/admin/gallery');
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Gallery fetch error:', error);
      setImages([]); // Set empty array instead of showing error
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('imageFile');
    if (!fileInput.files[0]) return;

    setUploading(true);
    const data = new FormData();
    data.append('image', fileInput.files[0]);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('showOnHomepage', formData.showOnHomepage);

    try {
      await api.post('/admin/gallery', data);
      toast.success('🇼️ Image uploaded successfully!');
      setFormData({ title: '', description: '', category: 'general', showOnHomepage: false });
      fileInput.value = '';
      fetchImages();
      onUpdate && onUpdate(); // Update homepage gallery
    } catch (error) {
      toast.error('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      toast.success('🗑️ Image deleted successfully!');
      fetchImages();
      onUpdate && onUpdate(); // Update homepage gallery
    } catch (error) {
      toast.error('❌ Delete failed');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
      <h3>🖼️ Gallery Management</h3>
      
      <form onSubmit={handleUpload} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <input type="text" placeholder="Image Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option value="general">General</option>
            <option value="events">Events</option>
            <option value="activities">Activities</option>
            <option value="ceremonies">Ceremonies</option>
          </select>
        </div>
        <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem' }} />
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input type="file" id="imageFile" accept="image/*" required style={{ padding: '10px' }} />
          <label><input type="checkbox" checked={formData.showOnHomepage} onChange={(e) => setFormData({...formData, showOnHomepage: e.target.checked})} /> Show on Homepage</label>
        </div>
        <button type="submit" disabled={uploading} style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {images.map(image => (
          <div key={image._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={`https://sanataningo.onrender.com${image.image}`} alt={image.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <div style={{ padding: '10px' }}>
              <h5 style={{ margin: '0 0 5px 0' }}>{image.title}</h5>
              <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0' }}>{image.category}</p>
              {image.showOnHomepage && <span style={{ background: '#28a745', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>Homepage</span>}
              <button onClick={() => deleteImage(image._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', marginTop: '10px', width: '100%' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamManagement = ({ onUpdate }) => {
  const [team, setTeam] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ name: '', position: '', bio: '', email: '', phone: '', showOnHomepage: true, showOnAbout: true });

  const fetchTeam = async () => {
    try {
      const response = await api.get('/admin/team');
      setTeam(response.data.team || []);
    } catch (error) {
      console.error('Team fetch error:', error);
      setTeam([]); // Set empty array instead of showing error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('photoFile');
    
    setUploading(true);
    const data = new FormData();
    if (fileInput.files[0]) data.append('photo', fileInput.files[0]);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await api.post('/admin/team', data);
      toast.success('👨💼 Team member added successfully!');
      setFormData({ name: '', position: '', bio: '', email: '', phone: '', showOnHomepage: true, showOnAbout: true });
      if (fileInput) fileInput.value = '';
      fetchTeam();
      onUpdate && onUpdate(); // Update homepage team section
    } catch (error) {
      toast.error('❌ Failed to add team member');
    } finally {
      setUploading(false);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    try {
      await api.delete(`/admin/team/${id}`);
      toast.success('🗑️ Team member deleted successfully!');
      fetchTeam();
      onUpdate && onUpdate(); // Update homepage team section
    } catch (error) {
      toast.error('❌ Delete failed');
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
      <h3>👥 Team Management</h3>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          <input type="text" placeholder="Position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <textarea placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem' }} />
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input type="file" id="photoFile" accept="image/*" style={{ padding: '10px' }} />
          <label><input type="checkbox" checked={formData.showOnHomepage} onChange={(e) => setFormData({...formData, showOnHomepage: e.target.checked})} /> Homepage</label>
          <label><input type="checkbox" checked={formData.showOnAbout} onChange={(e) => setFormData({...formData, showOnAbout: e.target.checked})} /> About Page</label>
        </div>
        <button type="submit" disabled={uploading} style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>
          {uploading ? 'Adding...' : 'Add Team Member'}
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {team.map(member => (
          <div key={member._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
            {member.photo && <img src={`https://sanataningo.onrender.com${member.photo}`} alt={member.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} />}
            <h5 style={{ margin: '0 0 5px 0' }}>{member.name}</h5>
            <p style={{ color: '#666', margin: '0 0 5px 0', fontSize: '14px' }}>{member.position}</p>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              {member.showOnHomepage && <span style={{ background: '#007bff', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>Home</span>}
              {member.showOnAbout && <span style={{ background: '#28a745', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>About</span>}
            </div>
            <button onClick={() => deleteMember(member._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', width: '100%' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventsManagement = ({ onUpdate }) => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', venue: '', eventDate: '', status: 'upcoming' });

  const fetchEvents = async () => {
    try {
      const response = await api.get('/admin/events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Events fetch error:', error);
      setEvents([]); // Set empty array instead of showing error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/events', formData);
      toast.success('🎉 Event created successfully!');
      setFormData({ title: '', description: '', venue: '', eventDate: '', status: 'upcoming' });
      fetchEvents();
      onUpdate && onUpdate(); // Update homepage events section
    } catch (error) {
      toast.error('❌ Failed to create event');
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/admin/events/${id}`);
      toast.success('🗑️ Event deleted successfully!');
      fetchEvents();
      onUpdate && onUpdate(); // Update homepage events section
    } catch (error) {
      toast.error('❌ Delete failed');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
      <h3>🎉 Events Management</h3>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <input type="text" placeholder="Event Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          <input type="text" placeholder="Venue" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <input type="datetime-local" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <textarea placeholder="Event Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem' }} />
        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>Create Event</button>
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Title</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Venue</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{event.title}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{new Date(event.eventDate).toLocaleDateString()}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{event.venue}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ background: event.status === 'completed' ? '#28a745' : event.status === 'ongoing' ? '#ffc107' : '#007bff', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{event.status}</span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <button onClick={() => deleteEvent(event._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem' }}>Delete</button>
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(() => {
          setIsLoggedIn(true);
          fetchDashboardData();
          // Auto-refresh every 30 seconds
          const interval = setInterval(fetchDashboardData, 30000);
          return () => clearInterval(interval);
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
        toast.success('🎉 Welcome to Admin Dashboard!');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('❌ Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setDashboardData(null);
    setActiveTab('dashboard');
    toast.success('👋 Logged out successfully!');
  };

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 6s ease-in-out infinite'
        }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(20px)',
            padding: '3rem', 
            borderRadius: '24px', 
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)', 
            maxWidth: '420px', 
            width: '100%',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{ fontSize: '4rem', marginBottom: '1rem' }}
            >
              🕉️
            </motion.div>
            <h2 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '1.8rem', fontWeight: '700' }}>Admin Portal</h2>
            <p style={{ color: '#718096', fontSize: '0.95rem' }}>Sarbo Shakti Sonatani Sangathan</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ marginBottom: '1.5rem' }}
            >
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568', fontSize: '0.9rem' }}>Email Address</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '12px', 
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#f7fafc'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />
            </motion.div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ marginBottom: '2rem' }}
            >
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568', fontSize: '0.9rem' }}>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '12px', 
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#f7fafc'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />
            </motion.div>
            
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', border: '2px solid #ffffff40', borderTop: '2px solid #ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Signing In...
                </div>
              ) : (
                '🚀 Access Dashboard'
              )}
            </motion.button>
          </form>
        </motion.div>
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', color: '#667eea' },
    { id: 'members', icon: '👥', label: 'Members', color: '#f093fb' },
    { id: 'donations', icon: '💰', label: 'Donations', color: '#4facfe' },
    { id: 'transactions', icon: '💳', label: 'Transactions', color: '#43e97b' },
    { id: 'contacts', icon: '📧', label: 'Contacts', color: '#fa709a' },
    { id: 'gallery', icon: '🖼️', label: 'Gallery', color: '#ffecd2' },
    { id: 'team', icon: '👨‍💼', label: 'Team', color: '#a8edea' },
    { id: 'events', icon: '🎉', label: 'Events', color: '#d299c2' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          width: sidebarOpen ? '280px' : '80px',
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '1rem',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
          transition: 'width 0.3s ease',
          overflowY: 'auto'
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <div style={{ fontSize: '1.8rem', marginRight: sidebarOpen ? '1rem' : '0' }}>🕉️</div>
          {sidebarOpen && (
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>Admin Panel</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9, color: 'rgba(255,255,255,0.8)' }}>Sangathan Dashboard</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, x: 5 }}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 0.5rem',
                marginBottom: '0.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                background: activeTab === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                backdropFilter: activeTab === item.id ? 'blur(10px)' : 'none',
                border: activeTab === item.id ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '1.3rem', marginRight: sidebarOpen ? '0.8rem' : '0', textAlign: 'center', width: '1.8rem' }}>
                {item.icon}
              </div>
              {sidebarOpen && (
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'white' }}>{item.label}</div>
                  {activeTab === item.id && (
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, color: 'rgba(255,255,255,0.7)' }}>Active</div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </nav>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '10px',
            borderRadius: '10px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          🚀 {sidebarOpen && 'Logout'}
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div style={{ 
        marginLeft: sidebarOpen ? '280px' : '80px', 
        flex: 1, 
        transition: 'margin-left 0.3s ease',
        background: '#f8fafc',
        minHeight: '100vh'
      }}>
        {/* Top Bar */}
        <div style={{
          background: 'white',
          padding: '1.5rem 2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              ☰
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: '#2d3748' }}>
                {menuItems.find(item => item.id === activeTab)?.icon} {menuItems.find(item => item.id === activeTab)?.label}
              </h1>
              <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>Manage your organization efficiently</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchDashboardData}
              disabled={refreshing}
              style={{
                background: refreshing ? '#e2e8f0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '10px',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div style={{ 
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                fontSize: '1rem'
              }}>
                🔄
              </div>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            
            <div style={{
              background: '#f1f5f9',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              color: '#4a5568',
              fontWeight: '600'
            }}>
              🕰️ {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '1.5rem' }}>

        {activeTab === 'dashboard' && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                  { icon: '👥', label: 'Total Members', value: dashboardData?.stats?.totalMembers || 0, color: '#667eea', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                  { icon: '✅', label: 'Active Members', value: dashboardData?.stats?.activeMembers || 0, color: '#4facfe', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
                  { icon: '⏳', label: 'Pending Approval', value: dashboardData?.stats?.pendingMembers || 0, color: '#f093fb', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
                  { icon: '❌', label: 'Rejected', value: dashboardData?.stats?.rejectedMembers || 0, color: '#fa709a', bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
                  { icon: '⏰', label: 'Expired', value: dashboardData?.stats?.expiredMembers || 0, color: '#a8edea', bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
                  { icon: '💰', label: "Today's Entries", value: dashboardData?.stats?.todayMembers || 0, color: '#ffecd2', bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Background Gradient */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: stat.bg,
                      borderRadius: '50%',
                      transform: 'translate(30px, -30px)',
                      opacity: 0.1
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{
                          background: stat.bg,
                          width: '60px',
                          height: '60px',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.8rem',
                          boxShadow: `0 8px 20px ${stat.color}40`
                        }}>
                          {stat.icon}
                        </div>
                        <div style={{
                          background: `${stat.color}20`,
                          color: stat.color,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          LIVE
                        </div>
                      </div>
                      
                      <h3 style={{ 
                        fontSize: '2.2rem', 
                        fontWeight: '800', 
                        margin: '0 0 0.5rem 0', 
                        color: '#2d3748'
                      }}>
                        {stat.value}
                      </h3>
                      
                      <p style={{ 
                        color: '#64748b', 
                        fontSize: '0.95rem', 
                        fontWeight: '600', 
                        margin: 0 
                      }}>
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      👥
                    </div>
                    <h3 style={{ color: '#2d3748', fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>Recent Members</h3>
                  </div>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {(dashboardData?.recentMembers || []).map((member, index) => (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          padding: '1rem',
                          borderBottom: '1px solid #f1f5f9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderRadius: '12px',
                          marginBottom: '0.5rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            marginRight: '1rem'
                          }}>
                            {member.fullName?.charAt(0) || 'M'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#2d3748' }}>{member.fullName}</div>
                            <div style={{ fontSize: '0.85rem', color: '#718096' }}>{member.email}</div>
                          </div>
                        </div>
                        <div style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {member.membershipPlan || 'Basic'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      💰
                    </div>
                    <h3 style={{ color: '#2d3748', fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>Recent Donations</h3>
                  </div>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {(dashboardData?.recentDonations || []).map((donation, index) => (
                      <motion.div
                        key={donation._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          padding: '1rem',
                          borderBottom: '1px solid #f1f5f9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderRadius: '12px',
                          marginBottom: '0.5rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            marginRight: '1rem'
                          }}>
                            {donation.donorName?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#2d3748' }}>{donation.donorName}</div>
                            <div style={{ fontSize: '0.85rem', color: '#718096' }}>{donation.purpose}</div>
                          </div>
                        </div>
                        <div style={{
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '700'
                        }}>
                          ₹{donation.amount}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'members' && (
            <motion.div key="members" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <MemberManagement onUpdate={fetchDashboardData} />
            </motion.div>
          )}
          {activeTab === 'donations' && (
            <motion.div key="donations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <DonationManagement onUpdate={fetchDashboardData} />
            </motion.div>
          )}
          {activeTab === 'transactions' && (
            <motion.div key="transactions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <TransactionManagement onUpdate={fetchDashboardData} />
            </motion.div>
          )}
          {activeTab === 'contacts' && (
            <motion.div key="contacts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ContactManagement onUpdate={fetchDashboardData} />
            </motion.div>
          )}
          {activeTab === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <GalleryManagement onUpdate={fetchDashboardData} />
            </motion.div>
          )}
          {activeTab === 'team' && (
            <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <TeamManagement onUpdate={fetchDashboardData} />
            </motion.div>
          )}
          {activeTab === 'events' && (
            <motion.div key="events" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <EventsManagement onUpdate={fetchDashboardData} />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Admin;