require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDB() {
  console.log('🔍 Testing database connection...\n');
  
  console.log('DB Config:');
  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  console.log('Port:', process.env.DB_PORT);
  console.log();
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    console.log('✅ Connected to database!');
    
    // Check if donations table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'donations'");
    console.log('Donations table exists:', tables.length > 0);
    
    if (tables.length > 0) {
      // Count donations
      const [count] = await connection.execute('SELECT COUNT(*) as total FROM donations');
      console.log('Total donations:', count[0].total);
      
      // Show recent donations
      const [recent] = await connection.execute('SELECT * FROM donations ORDER BY created_at DESC LIMIT 3');
      console.log('Recent donations:', recent.length);
      recent.forEach(d => console.log(`- ${d.donor_name}: ₹${d.amount}`));
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

testDB();