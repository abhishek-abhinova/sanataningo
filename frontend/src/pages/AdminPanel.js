import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      const response = await api.get('/media');
      setMedia(response.data.media);
    } catch (error) {
      toast.error('Failed to fetch media');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'image');

    try {
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('File uploaded successfully');
      fetchMedia();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (id) => {
    if (!window.confirm('Delete this file?')) return;
    
    try {
      await api.delete(`/media/${id}`);
      toast.success('File deleted');
      fetchMedia();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
      <h3>📁 Media Manager</h3>
      
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="file"
          onChange={handleUpload}
          accept="image/*,video/*,.pdf"
          disabled={uploading}
          style={{ padding: '10px', border: '2px dashed #ddd', borderRadius: '8px' }}
        />
        {uploading && <span style={{ marginLeft: '10px' }}>Uploading...</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {media.map(item => (
          <div key={item._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
            {item.mimetype.startsWith('image/') ? (
              <img src={`https://sarboshakti-backend.onrender.com${item.path}`} alt={item.originalName} 
                   style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
            ) : (
              <div style={{ height: '120px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                📄 {item.originalName}
              </div>
            )}
            <p style={{ fontSize: '12px', margin: '5px 0' }}>{item.originalName}</p>
            <button onClick={() => deleteMedia(item._id)} 
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', venue: '', eventDate: '', status: 'upcoming'
  });

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events);
    } catch (error) {
      toast.error('Failed to fetch events');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', formData);
      toast.success('Event created successfully');
      setShowForm(false);
      setFormData({ title: '', description: '', venue: '', eventDate: '', status: 'upcoming' });
      fetchEvents();
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3>🎉 Events Manager</h3>
        <button onClick={() => setShowForm(!showForm)}
                style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px' }}>
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <textarea
              placeholder="Event Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Venue"
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="datetime-local"
              value={formData.eventDate}
              onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>
            Create Event
          </button>
        </form>
      )}

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
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  {new Date(event.eventDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{event.venue}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{ 
                    background: event.status === 'completed' ? '#28a745' : event.status === 'ongoing' ? '#ffc107' : '#007bff',
                    color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' 
                  }}>
                    {event.status}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                  <button onClick={() => deleteEvent(event._id)}
                          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SettingsManager = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data.settings);
    } catch (error) {
      toast.error('Failed to fetch settings');
    }
  };

  const updateSetting = async (key, value) => {
    setLoading(true);
    try {
      await api.put(`/settings/${key}`, { value });
      toast.success('Setting updated');
      fetchSettings();
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
      <h3>⚙️ Settings Manager</h3>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Organization Name</label>
          <input
            type="text"
            value={settings.org_name || ''}
            onChange={(e) => updateSetting('org_name', e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Phone</label>
          <input
            type="text"
            value={settings.contact_phone || ''}
            onChange={(e) => updateSetting('contact_phone', e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Email</label>
          <input
            type="email"
            value={settings.contact_email || ''}
            onChange={(e) => updateSetting('contact_email', e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Address</label>
          <textarea
            value={settings.address || ''}
            onChange={(e) => updateSetting('address', e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
          />
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('media');

  const tabs = [
    { id: 'media', label: '📁 Media', component: MediaManager },
    { id: 'events', label: '🎉 Events', component: EventsManager },
    { id: 'settings', label: '⚙️ Settings', component: SettingsManager }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || MediaManager;

  return (
    <div style={{ marginTop: '90px', minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', color: 'white', padding: '2rem 0' }}>
        <div className="container">
          <h1>🛡️ Admin Panel</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #d2691e, #ff8c00)' : '#e9ecef',
                color: activeTab === tab.id ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ActiveComponent />
      </div>
    </div>
  );
};

export default AdminPanel;