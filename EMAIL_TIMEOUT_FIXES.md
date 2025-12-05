# Email Timeout Issues - Complete Fix Guide

## Problem Summary
Your application is experiencing SMTP connection timeouts when sending donation receipt emails, causing the following errors:
- `Connection timeout`
- `ETIMEDOUT`
- `Ethereal fallback failed`

## Root Causes
1. **SMTP Server Connectivity Issues**: Hostinger SMTP server may be temporarily unavailable or slow
2. **Network Timeouts**: Default timeout values too low for production environment
3. **No Proper Fallback Mechanism**: Single point of failure
4. **Synchronous Email Sending**: Blocking the main thread and causing request timeouts

## Solutions Implemented

### 1. Improved Email Service (`emailServiceImproved.js`)
- **Multiple Transporters**: Primary (Hostinger) + Fallback (Gmail) + Test (Ethereal)
- **Enhanced Timeouts**: Increased connection, greeting, and socket timeouts to 10-15 seconds
- **Connection Pooling**: Reuse connections for better performance
- **Exponential Backoff**: Smart retry mechanism with increasing delays
- **Queue-based Processing**: Async email sending to prevent request timeouts

### 2. Key Features
```javascript
// Multiple fallback options
const transporters = [
  'Hostinger SMTP',    // Primary
  'Gmail SMTP',        // Fallback
  'Ethereal Test'      // Development/Testing
];

// Enhanced timeout settings
connectionTimeout: 10000,  // 10 seconds
greetingTimeout: 10000,    // 10 seconds  
socketTimeout: 10000,      // 10 seconds

// Queue-based processing
queueEmail(mailOptions, {
  onSuccess: () => console.log('Email queued successfully'),
  onError: (error) => console.error('Email failed:', error)
});
```

### 3. Environment Variables Required
```bash
# Primary SMTP (Hostinger)
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-email-password
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587

# Fallback SMTP (Gmail - Optional but Recommended)
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASS=your-gmail-app-password

# Organization Details
ORG_EMAIL=info@yourorganization.org
ORG_NAME=Your Organization Name
```

## Testing & Verification

### 1. Test Email Configuration
```bash
# Test SMTP configuration
GET /api/email-test/test-config

# Send test email
POST /api/email-test/send-test
{
  "to": "test@example.com",
  "subject": "Test Email",
  "message": "Testing email functionality"
}
```

### 2. Monitor Email Queue
The new system uses async processing:
- Emails are queued immediately
- Processing happens in background
- No request timeouts
- Automatic retries with fallbacks

### 3. Error Handling
```javascript
// Graceful error handling
try {
  await sendDonationReceiptWithPDF(donation, receiptPath, true);
  console.log('✅ Email queued successfully');
} catch (error) {
  console.error('❌ Email failed:', error);
  // Application continues without crashing
}
```

## Implementation Steps

### 1. Update Your Routes
The donation routes have been updated to use the new email service:
```javascript
const { sendDonationReceiptWithPDF } = require('../utils/emailServiceImproved');

// Use queue-based sending
await sendDonationReceiptWithPDF(donation, receiptPath, true);
```

### 2. Configure Environment Variables
Ensure these are set in your `.env` file:
```bash
SMTP_USER=your-hostinger-email@yourdomain.com
SMTP_PASS=your-hostinger-password
GMAIL_USER=your-backup-gmail@gmail.com  # Optional fallback
GMAIL_PASS=your-gmail-app-password      # Optional fallback
ORG_EMAIL=info@yourorganization.org
ORG_NAME=Sarboshakti Sanatani Sangathan
```

### 3. Test the Configuration
1. Start your server
2. Visit: `GET /api/email-test/test-config`
3. Send test email: `POST /api/email-test/send-test`

## Monitoring & Logs

### Success Indicators
```
✅ Email sent successfully via Hostinger
✅ Donation receipt queued successfully
📧 Processing email queue (1 emails)
```

### Failure Indicators
```
❌ Hostinger attempt 1 failed: Connection timeout
⏳ Waiting 1000ms before retry...
🛠️ Falling back to Gmail transporter
```

## Production Recommendations

### 1. Email Provider Settings
- **Hostinger**: Ensure SMTP is enabled in your hosting panel
- **Gmail**: Use App Passwords, not regular passwords
- **Firewall**: Ensure ports 587/465 are open

### 2. Monitoring
- Monitor email queue processing
- Set up alerts for email failures
- Regular testing of email functionality

### 3. Backup Strategy
- Always configure at least 2 email providers
- Test fallback mechanisms regularly
- Keep Ethereal as development fallback

## Troubleshooting Common Issues

### Issue: "No email transporters configured"
**Solution**: Check environment variables are properly set

### Issue: "Gmail authentication failed"
**Solution**: Use Gmail App Password instead of regular password

### Issue: "Connection timeout persists"
**Solution**: Check firewall settings and network connectivity

### Issue: "Emails not being sent"
**Solution**: Check email queue processing and logs

## Files Modified/Created
1. `backend/utils/emailServiceImproved.js` - New improved email service
2. `backend/routes/email-test.js` - Email testing endpoints
3. `backend/utils/emailConfig.js` - Configuration validator
4. `backend/routes/donations.js` - Updated to use new service
5. `backend/server.js` - Added email test routes

## Next Steps
1. Test the new email system with the provided endpoints
2. Configure Gmail fallback for better reliability
3. Monitor email processing in production
4. Set up proper logging and alerting

The new system should resolve your timeout issues by:
- Using multiple email providers
- Processing emails asynchronously
- Implementing proper retry mechanisms
- Providing better error handling and logging