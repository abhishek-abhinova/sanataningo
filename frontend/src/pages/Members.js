import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/public/team');
      setMembers(response.data.team || []);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesFilter = filter === 'all' || member.type === filter;
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const teamMembers = filteredMembers.filter(m => m.type === 'team_member');
  const regularMembers = filteredMembers.filter(m => m.type === 'regular_member');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading members...</p>
      </div>
    );
  }

  return (
    <div className="members-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-users"></i> Our Members</h1>
          <p>Meet our dedicated team members and valued community members</p>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-container">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              <button
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                All ({members.length})
              </button>
              <button
                className={filter === 'team_member' ? 'active' : ''}
                onClick={() => setFilter('team_member')}
              >
                Team Members ({teamMembers.length})
              </button>
              <button
                className={filter === 'regular_member' ? 'active' : ''}
                onClick={() => setFilter('regular_member')}
              >
                Members ({regularMembers.length})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      {(filter === 'all' || filter === 'team_member') && teamMembers.length > 0 && (
        <section className="team-members-section">
          <div className="container">
            <h2><i className="fas fa-user-tie"></i> Team Members</h2>
            <div className="members-grid">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member._id}
                  className="member-card team-member"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {member.photo && (
                    <div className="member-photo">
                      <img
                        src={member.photo.startsWith('http') ? member.photo : `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/${member.photo.replace(/^\/+/, '')}`}
                        alt={member.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p className="position">{member.position}</p>
                    {member.bio && <p className="bio">{member.bio}</p>}
                    <span className="member-badge team">Team Member</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Members Section */}
      {(filter === 'all' || filter === 'regular_member') && regularMembers.length > 0 && (
        <section className="regular-members-section">
          <div className="container">
            <h2><i className="fas fa-users"></i> Community Members</h2>
            <div className="members-grid">
              {regularMembers.map((member, index) => (
                <motion.div
                  key={member._id}
                  className="member-card regular-member"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p className="position">{member.position}</p>
                    {member.memberId && <p className="member-id">ID: {member.memberId}</p>}
                    {member.membershipType && (
                      <p className="membership-type">{member.membershipType} Member</p>
                    )}
                    <span className="member-badge regular">Community Member</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {filteredMembers.length === 0 && (
        <section className="no-members">
          <div className="container">
            <p>No members found matching your criteria.</p>
          </div>
        </section>
      )}

      <style jsx>{`
        .members-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .page-header {
          background: linear-gradient(135deg, #8b4513 0%, #d2691e 100%);
          color: white;
          padding: 4rem 0 2rem;
          text-align: center;
        }

        .page-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .page-header p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .filters-section {
          padding: 2rem 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .filters-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
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
          color: #666;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 25px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-box input:focus {
          outline: none;
          border-color: #d2691e;
          box-shadow: 0 0 0 3px rgba(210, 105, 30, 0.1);
        }

        .filter-buttons {
          display: flex;
          gap: 1rem;
        }

        .filter-buttons button {
          padding: 0.75rem 1.5rem;
          border: 2px solid #d2691e;
          background: white;
          color: #d2691e;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .filter-buttons button.active,
        .filter-buttons button:hover {
          background: #d2691e;
          color: white;
        }

        .team-members-section,
        .regular-members-section {
          padding: 3rem 0;
        }

        .team-members-section h2,
        .regular-members-section h2 {
          text-align: center;
          margin-bottom: 3rem;
          color: #8b4513;
          font-size: 2.5rem;
          font-weight: 700;
        }

        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .member-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .member-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .member-card.team-member {
          border-color: #e3f2fd;
        }

        .member-card.regular-member {
          border-color: #f3e5f5;
        }

        .member-photo {
          margin-bottom: 1.5rem;
        }

        .member-photo img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #d2691e;
        }

        .member-info h3 {
          color: #8b4513;
          margin-bottom: 0.5rem;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .position {
          color: #d2691e;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .bio {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .member-id {
          font-size: 0.9rem;
          color: #666;
          margin: 0.5rem 0;
          font-weight: 600;
        }

        .membership-type {
          font-size: 0.9rem;
          color: #d2691e;
          margin: 0.5rem 0;
          font-weight: 600;
          text-transform: capitalize;
        }

        .member-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 1rem;
        }

        .member-badge.team {
          background: #e3f2fd;
          color: #1565c0;
        }

        .member-badge.regular {
          background: #f3e5f5;
          color: #7b1fa2;
        }

        .no-members {
          padding: 4rem 0;
          text-align: center;
          color: #666;
          font-size: 1.2rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          color: #666;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #d2691e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }

          .filters-container {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .filter-buttons {
            justify-content: center;
            flex-wrap: wrap;
          }

          .members-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .member-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Members;