const mysql = require('mysql2');

// Test different host options
const hosts = [
  'mysql.hostinger.com',
  'srv1150.hstgr.io',
  'srv1151.hstgr.io',
  'localhost'
];

const dbConfig = {
  user: 'u391855440_sarboshakti',
  password: '>k7QKB46am',
  database: 'u391855440_sarboshaktingo',
  port: 3306,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
};

async function testConnection(host) {
  return new Promise((resolve) => {
    const connection = mysql.createConnection({
      ...dbConfig,
      host: host
    });

    connection.connect((err) => {
      if (err) {
        console.log(`❌ ${host}: ${err.message}`);
        resolve(false);
      } else {
        console.log(`✅ ${host}: Connected successfully!`);
        connection.end();
        resolve(true);
      }
    });
  });
}

async function findWorkingHost() {
  console.log('🔍 Testing MySQL hosts...\n');
  
  for (const host of hosts) {
    const success = await testConnection(host);
    if (success) {
      console.log(`\n🎯 Use this host: ${host}`);
      return;
    }
  }
  
  console.log('\n❌ No working host found. Check:');
  console.log('1. Remote MySQL is enabled in Hostinger');
  console.log('2. Database credentials are correct');
  console.log('3. Database exists');
}

findWorkingHost();