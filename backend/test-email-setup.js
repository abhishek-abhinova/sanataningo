const { testEmailConfiguration, sendEmailWithFallbacks } = require('./utils/emailServiceImproved');
const { getEmailConfigSummary } = require('./utils/emailConfig');
require('dotenv').config();

async function testEmailSetup() {
  console.log('🔍 Testing Email Configuration...\n');
  
  // 1. Check configuration
  console.log('1. Checking Environment Variables:');
  const configSummary = getEmailConfigSummary();
  console.log('Status:', configSummary.status);
  console.log('Available Transporters:', configSummary.transporters);
  
  if (configSummary.errors.length > 0) {
    console.log('❌ Errors:');
    configSummary.errors.forEach(error => console.log('  -', error));
  }
  
  if (configSummary.warnings.length > 0) {
    console.log('⚠️ Warnings:');
    configSummary.warnings.forEach(warning => console.log('  -', warning));
  }
  
  console.log('\n2. Testing SMTP Connections:');
  
  // 2. Test connections
  try {
    const testResults = await testEmailConfiguration();
    testResults.forEach(result => {
      const status = result.status === 'success' ? '✅' : '❌';
      console.log(`${status} ${result.name}: ${result.message}`);
    });
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
  
  // 3. Send test email if configuration is valid
  if (configSummary.status === 'valid') {
    console.log('\n3. Sending Test Email:');
    
    const testEmail = process.env.TEST_EMAIL || process.env.ORG_EMAIL || process.env.SMTP_USER;
    
    if (testEmail) {
      try {
        const mailOptions = {
          from: `"${process.env.ORG_NAME || 'Test'}" <${process.env.SMTP_USER}>`,
          to: testEmail,
          subject: '✅ Email Configuration Test - Success!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #d4edda; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #28a745;">
                <h2 style="color: #155724; margin: 0;">✅ Email Configuration Working!</h2>
                <p style="color: #155724; margin: 10px 0;">Your email system is properly configured and working.</p>
                <p style="font-size: 12px; color: #6c757d;">Test completed at: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `
        };
        
        console.log(`📧 Sending test email to: ${testEmail}`);
        const result = await sendEmailWithFallbacks(mailOptions);
        
        if (result.isTestEmail) {
          console.log('✅ Test email sent via Ethereal (preview only)');
          console.log('🔗 Preview URL:', result.previewUrl);
        } else {
          console.log('✅ Test email sent successfully!');
          console.log('📧 Message ID:', result.messageId);
        }
      } catch (error) {
        console.error('❌ Test email failed:', error.message);
      }
    } else {
      console.log('⚠️ No test email address configured. Set TEST_EMAIL in .env file.');
    }
  } else {
    console.log('\n❌ Email configuration invalid. Please fix the errors above.');
  }
  
  console.log('\n📋 Configuration Summary:');
  console.log('SMTP Host:', configSummary.settings.smtpHost);
  console.log('SMTP Port:', configSummary.settings.smtpPort);
  console.log('SMTP User:', configSummary.settings.smtpUser);
  console.log('Org Email:', configSummary.settings.orgEmail);
  console.log('Gmail Fallback:', configSummary.settings.hasGmailFallback ? 'Yes' : 'No');
  
  console.log('\n🚀 Email setup test completed!');
}

// Run the test
testEmailSetup().catch(error => {
  console.error('❌ Email setup test failed:', error);
  process.exit(1);
});