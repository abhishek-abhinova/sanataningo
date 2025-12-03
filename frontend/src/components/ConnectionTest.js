import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('testing');
  const [details, setDetails] = useState({});

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    const results = {};
    
    try {
      // Test health endpoint with direct URL to avoid double /api
      const healthUrl = `${process.env.REACT_APP_BACKEND_URL}/api/health`;
      console.log('Testing health endpoint:', healthUrl);
      
      const healthResponse = await fetch(healthUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      results.health = {
        status: healthResponse.status,
        ok: healthResponse.ok,
        url: healthUrl,
        data: healthResponse.ok ? await healthResponse.json() : await healthResponse.text()
      };
    } catch (error) {
      results.health = { error: error.message, url: `${process.env.REACT_APP_BACKEND_URL}/api/health` };
    }

    try {
      // Test login endpoint with direct URL
      const loginUrl = `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`;
      console.log('Testing login endpoint:', loginUrl);
      
      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });
      
      results.login = {
        status: loginResponse.status,
        ok: loginResponse.ok,
        url: loginUrl,
        data: await loginResponse.json()
      };
    } catch (error) {
      results.login = { error: error.message, url: `${process.env.REACT_APP_BACKEND_URL}/api/auth/login` };
    }

    setDetails(results);
    setStatus('completed');
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '300px',
      fontSize: '0.8rem',
      zIndex: 9999
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Backend Connection Test</h4>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Backend URL:</strong><br/>
        <span style={{ fontSize: '0.7rem', color: '#666' }}>
          {process.env.REACT_APP_BACKEND_URL}
        </span>
      </div>

      {status === 'testing' && (
        <div style={{ color: '#007bff' }}>🔄 Testing connection...</div>
      )}

      {status === 'completed' && (
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Health Check:</strong>
            {details.health?.error ? (
              <div style={{ color: '#dc3545' }}>
                ❌ {details.health.error}
                <div style={{ fontSize: '0.6rem', color: '#999' }}>{details.health.url}</div>
              </div>
            ) : (
              <div style={{ color: details.health?.ok ? '#28a745' : '#dc3545' }}>
                {details.health?.ok ? '✅' : '❌'} Status: {details.health?.status}
                <div style={{ fontSize: '0.6rem', color: '#999' }}>{details.health.url}</div>
              </div>
            )}
          </div>

          <div>
            <strong>Login Endpoint:</strong>
            {details.login?.error ? (
              <div style={{ color: '#dc3545' }}>
                ❌ {details.login.error}
                <div style={{ fontSize: '0.6rem', color: '#999' }}>{details.login.url}</div>
              </div>
            ) : (
              <div style={{ color: details.login?.status === 401 ? '#28a745' : '#dc3545' }}>
                {details.login?.status === 401 ? '✅' : '❌'} Status: {details.login?.status}
                <div style={{ fontSize: '0.6rem', color: '#999' }}>{details.login.url}</div>
                {details.login?.data?.error && (
                  <div style={{ fontSize: '0.7rem', color: '#666' }}>
                    {details.login.data.error}
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={testConnection}
            style={{
              marginTop: '0.5rem',
              padding: '4px 8px',
              fontSize: '0.7rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retest
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;