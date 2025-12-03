const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sarboshakti_ngo',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Get promise-based pool
const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ MySQL Database Connected Successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
    return false;
  }
};

// Get connection status
const getConnectionStatus = () => {
  return pool._allConnections.length > 0 && pool._freeConnections.length >= 0;
};

// Graceful shutdown
const closePool = async () => {
  try {
    await promisePool.end();
    console.log('✅ MySQL connection pool closed');
  } catch (error) {
    console.error('❌ Error closing MySQL pool:', error);
  }
};

module.exports = {
  pool,
  promisePool,
  testConnection,
  getConnectionStatus,
  closePool
};
