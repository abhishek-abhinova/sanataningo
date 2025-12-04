const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'srv1150.hstgr.io', // Your Hostinger DB host
  user: 'u391855440_sarboshakti',
  password: '>k7QKB46am',
  database: 'u391855440_sarboshaktingo'
};

async function updateAdminPassword() {
  try {
    // New password (change this)
    const newPassword = 'YourNewSecurePassword123!';
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    console.log('🔐 New password hash:', hashedPassword);
    
    // Connect to database
    const connection = await mysql.createConnection(dbConfig);
    
    // Update admin password
    const [result] = await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, 'admin@sarboshaktisonatanisangathan.org']
    );
    
    if (result.affectedRows > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('📧 Email: admin@sarboshaktisonatanisangathan.org');
      console.log('🔑 New Password:', newPassword);
    } else {
      console.log('❌ Admin user not found');
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
  }
}

// Run the update
updateAdminPassword();