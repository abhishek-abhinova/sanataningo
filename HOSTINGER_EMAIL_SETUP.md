# Hostinger Email Setup Guide

## 📧 Setting up SMTP for info@sarboshaktisonatanisangathan.org

### Step 1: Access Hostinger Email Settings
1. Login to your **Hostinger Control Panel**
2. Go to **Email** section
3. Find your email account: `info@sarboshaktisonatanisangathan.org`

### Step 2: Get SMTP Configuration
**Hostinger SMTP Settings:**
- **SMTP Server**: `smtp.hostinger.com`
- **Port**: `587` (TLS) or `465` (SSL)
- **Security**: TLS/STARTTLS
- **Username**: `info@sarboshaktisonatanisangathan.org`
- **Password**: Your email account password

### Step 3: Update Backend Configuration
Update your `.env` file:
```env
# Email Configuration (Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@sarboshaktisonatanisangathan.org
SMTP_PASS=your-email-password-here
```

### Step 4: Enable SMTP Authentication
1. In Hostinger control panel, go to **Email Accounts**
2. Click on your email account
3. Ensure **SMTP Authentication** is enabled
4. Note down your email password (this is your SMTP password)

### Step 5: Test Email Configuration
After updating the `.env` file:
1. Restart your backend server
2. Test by submitting a contact form or membership application
3. Check if emails are being sent successfully

## 🔧 Alternative SMTP Settings (if needed)

If `smtp.hostinger.com` doesn't work, try:
- **SMTP Server**: `smtp.hostinger.in` (for Indian servers)
- **Port**: `587` or `465`

## 🚨 Important Notes

1. **No App Password Required**: Unlike Gmail, Hostinger uses your regular email password
2. **Security**: Make sure to use TLS/SSL encryption
3. **Firewall**: Ensure ports 587/465 are not blocked
4. **Rate Limits**: Hostinger may have sending limits (usually 100-300 emails/hour)

## 📝 Current Configuration

Your backend is already configured with:
```javascript
// Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@sarboshaktisonatanisangathan.org
SMTP_PASS=your-hostinger-email-password
```

## ✅ Verification Steps

1. **Test Connection**: Send a test email through the application
2. **Check Logs**: Monitor backend console for SMTP errors
3. **Verify Delivery**: Check if emails reach recipients
4. **Check Spam**: Ensure emails don't go to spam folder

## 🔍 Troubleshooting

**Common Issues:**
- **Authentication Failed**: Check email password
- **Connection Timeout**: Verify SMTP server and port
- **TLS Errors**: Try port 465 with SSL instead of 587 with TLS

**Debug Steps:**
1. Enable SMTP debugging in your email service
2. Check Hostinger email logs
3. Test with a simple email client first
4. Contact Hostinger support if issues persist

---

**Ready to Send Emails! 📧**

Your application will now send:
- ✅ Membership welcome emails
- ✅ Donation receipts  
- ✅ Contact confirmations
- ✅ Admin notifications