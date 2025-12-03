/**
 * Email Configuration Checker
 * Run this script to verify your email configuration
 * Usage: node check-email-config.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Checking Email Configuration...\n');

// Check environment variables
const requiredVars = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  ORG_EMAIL: process.env.ORG_EMAIL,
  ORG_NAME: process.env.ORG_NAME
};

console.log('📋 Environment Variables:');
console.log('─'.repeat(50));
let allSet = true;

for (const [key, value] of Object.entries(requiredVars)) {
  if (!value) {
    console.log(`❌ ${key}: NOT SET`);
    allSet = false;
  } else {
    if (key === 'SMTP_PASS') {
      console.log(`✅ ${key}: ${'*'.repeat(value.length)} (${value.length} characters)`);
    } else {
      console.log(`✅ ${key}: ${value}`);
    }
  }
}

console.log('─'.repeat(50));

if (!allSet) {
  console.error('\n❌ Some required environment variables are missing!');
  console.error('Please check your .env file in the backend/ directory.\n');
  process.exit(1);
}

// Test SMTP connection
console.log('\n🔌 Testing SMTP Connection...');
console.log(`Host: ${requiredVars.SMTP_HOST}`);
console.log(`Port: ${requiredVars.SMTP_PORT}`);
console.log(`User: ${requiredVars.SMTP_USER}\n`);

const transporter = nodemailer.createTransport({
  host: requiredVars.SMTP_HOST,
  port: parseInt(requiredVars.SMTP_PORT, 10) || 587,
  secure: requiredVars.SMTP_PORT === '465',
  auth: {
    user: requiredVars.SMTP_USER,
    pass: requiredVars.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Failed!');
    console.error('Error:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Check if SMTP_HOST is correct');
    console.error('2. Check if SMTP_PORT is correct (587 for STARTTLS, 465 for SSL)');
    console.error('3. Verify SMTP_USER and SMTP_PASS are correct');
    console.error('4. Check if your firewall is blocking the connection');
    console.error('5. Verify your email provider allows SMTP access');
    process.exit(1);
  } else {
    console.log('✅ SMTP Connection Successful!');
    console.log('\n📧 Email Configuration Summary:');
    console.log('─'.repeat(50));
    console.log(`From Address: "${requiredVars.ORG_NAME}" <${requiredVars.SMTP_USER}>`);
    console.log(`Reply To: ${requiredVars.ORG_EMAIL}`);
    console.log(`SMTP Server: ${requiredVars.SMTP_HOST}:${requiredVars.SMTP_PORT}`);
    console.log('─'.repeat(50));
    console.log('\n✅ Your email configuration is ready!');
    console.log('You can now test sending emails using:');
    console.log('  GET  http://localhost:5000/api/test/test-smtp-config');
    console.log('  POST http://localhost:5000/api/test/test-donation-receipt-pdf');
    console.log('\n');
    process.exit(0);
  }
});

