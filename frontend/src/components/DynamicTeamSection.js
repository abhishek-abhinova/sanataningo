import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const DynamicTeamSection = ({ category, showOnHomepage = false, limit = 8 }) => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, [category, showOnHomepage]);

  const fetchTeam = async () => {
    try {
      let endpoint = '/public/team';
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (showOnHomepage) endpoint = '/public/team/homepage';
      
      const response = await api.get(`${endpoint}${params.toString() ? '?' + params.toString() : ''}`);
      setTeam(response.data.team || []);
    } catch (error) {
      console.error('Failed to fetch team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="team-loading">
        <div className="loading-spinner"></div>
        <p>Loading team members...</p>
      </div>
    );
  }

  if (team.length === 0) {
    return null;
  }

  return (
    <div className="dynamic-team-section">
      <div className="team-grid">
        {team.slice(0, limit).map((member) => (
          <div key={member._id} className="team-member-card">
            <div className="member-photo">
              <img 
                src={member.photo || '/images/default-avatar.png'} 
                alt={member.name}
                onError={(e) => {
                  e.target.src = '/images/default-avatar.png';
                }}
              />
            </div>
            <div className="member-info">
              <h3>{member.name}</h3>
              <p className="position">{member.position}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dynamic-team-section {
          padding: 2rem 0;
        }
        .team-loading {
          text-align: center;
          padding: 3rem;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #d2691e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .team-member-card {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .team-member-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
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
          font-size: 1.3rem;
        }
        .position {
          color: #d2691e;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .category-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .category-badge.founder {
          background: #d4edda;
          color: #155724;
        }
        .category-badge.trustee {
          background: #cce5ff;
          color: #004085;
        }
        .category-badge.core_member {
          background: #fff3cd;
          color: #856404;
        }
        .category-badge.volunteer {
          background: #f8d7da;
          color: #721c24;
        }
        .bio {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .member-message {
          font-style: italic;
          color: #8b4513;
          border-left: 3px solid #d2691e;
          padding-left: 1rem;
          margin: 1rem 0;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .team-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .team-member-card {
            padding: 1.5rem;
          }
          .member-photo img {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicTeamSection;