const nodemailer = require('nodemailer');

// Test different SMTP configurations for Hostinger
const configs = [
  {
    name: 'Hostinger SSL (Port 465)',
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'info@sarboshaktisonatanisangathan.org',
      pass: 'Sangathan@123'
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  },
  {
    name: 'Hostinger TLS (Port 587)',
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false,
    auth: {
      user: 'info@sarboshaktisonatanisangathan.org',
      pass: 'Sangathan@123'
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  },
  {
    name: 'Gmail Backup',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'info@sarboshaktisonatanisangathan.org',
      pass: 'Sangathan@123'
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  }
];

async function testSMTP(config) {
  console.log(`\n🔍 Testing: ${config.name}`);
  
  try {
    const transporter = nodemailer.createTransport(config);
    
    // Verify connection
    await transporter.verify();
    console.log(`✅ ${config.name}: Connection successful!`);
    
    // Test sending email
    const info = await transporter.sendMail({
      from: 'info@sarboshaktisonatanisangathan.org',
      to: 'info@sarboshaktisonatanisangathan.org',
      subject: 'SMTP Test',
      text: 'Test email from Render backend'
    });
    
    console.log(`✅ ${config.name}: Email sent! Message ID: ${info.messageId}`);
    return true;
    
  } catch (error) {
    console.log(`❌ ${config.name}: ${error.message}`);
    return false;
  }
}

async function findWorkingSMTP() {
  console.log('🔍 Testing SMTP configurations...\n');
  
  for (const config of configs) {
    const success = await testSMTP(config);
    if (success) {
      console.log(`\n🎯 Use this configuration:`);
      console.log(`Host: ${config.host}`);
      console.log(`Port: ${config.port}`);
      console.log(`Secure: ${config.secure}`);
      return;
    }
  }
  
  console.log('\n❌ No working SMTP found. Check:');
  console.log('1. Email account exists in Hostinger');
  console.log('2. Password is correct');
  console.log('3. SMTP is enabled for the email account');
}

findWorkingSMTP();