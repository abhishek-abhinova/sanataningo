import React from 'react';
import TeamUpload from '../components/TeamUpload';

const TeamUploadPage = () => {
  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-users"></i> Team Management</h1>
          <p><i className="fas fa-star-of-david"></i> Upload team member images <i className="fas fa-star-of-david"></i></p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="content-section">
        <div className="container">
          <TeamUpload />
        </div>
      </section>
    </div>
  );
};

export default TeamUploadPage;