# Email Troubleshooting Guide

## Issue: Emails Show Success but Not Received

If you're seeing success messages in the terminal and UI, but emails are not being delivered, follow these steps:

### 1. Check SMTP Configuration

Verify your `.env` file has the correct SMTP settings:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@sarboshaktisonatanisangathan.org
SMTP_PASS=your-password-here
ORG_EMAIL=info@sarboshaktisonatanisangathan.org
ORG_NAME=Sarbo Shakti Sonatani Sangathan
```

### 2. Test SMTP Configuration

Run the test endpoint to verify SMTP settings:

```bash
curl http://localhost:5000/api/test/test-smtp-config
```

Or visit in browser: `http://localhost:5000/api/test/test-smtp-config`

### 3. Test Email Sending

Test sending a donation receipt email:

```bash
curl -X POST http://localhost:5000/api/test/test-donation-receipt-pdf \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

Or use Postman/Thunder Client to test the endpoint.

### 4. Common Issues and Solutions

#### Issue A: Email Accepted by SMTP but Not Delivered

**Symptoms:**
- Terminal shows "Email sent successfully"
- Message ID is generated
- But email never arrives (not in inbox or spam)

**Possible Causes:**

1. **SPF/DKIM/DMARC Issues**
   - Hostinger requires proper DNS records
   - Check your domain's SPF, DKIM, and DMARC records
   - Contact Hostinger support to verify email authentication setup

2. **From Address Mismatch**
   - The "from" address MUST match SMTP_USER exactly
   - Format: `"Organization Name" <email@domain.com>`
   - Email part must be exactly: `info@sarboshaktisonatanisangathan.org`

3. **Email Provider Blocking**
   - Some email providers (Gmail, Outlook) may block emails from new domains
   - Check if emails are being blocked by recipient's email provider
   - Try sending to a different email provider (Yahoo, ProtonMail, etc.)

4. **Rate Limiting**
   - Hostinger may have rate limits on email sending
   - Wait a few minutes between test emails
   - Check Hostinger email sending limits

#### Issue B: Timeout Errors

**Symptoms:**
- "timeout exceeded" errors in terminal
- Email sending fails after 10 seconds

**Solution:**
- Timeouts have been increased to 60 seconds
- Check your internet connection
- Verify SMTP server is accessible: `telnet smtp.hostinger.com 587`

#### Issue C: Authentication Errors

**Symptoms:**
- "Authentication failed" errors
- "Invalid credentials" messages

**Solution:**
- Verify SMTP_USER and SMTP_PASS are correct
- For Hostinger, use the full email address as username
- Check if password has special characters that need escaping
- Try resetting the email password in Hostinger panel

### 5. Verify Email Delivery

1. **Check Server Logs**
   - Look for detailed email send results in terminal
   - Check for `messageId`, `accepted`, and `rejected` fields
   - If `rejected` array has entries, those emails failed

2. **Check Email Provider**
   - Log into Hostinger email panel
   - Check "Sent" folder to see if email was sent
   - Check for any bounce messages

3. **Check Recipient Email**
   - Check spam/junk folder
   - Check email filters
   - Try sending to a different email address
   - Check if email provider has blocked your domain

### 6. Debug Mode

Enable debug logging by setting in `.env`:

```env
NODE_ENV=development
```

This will show detailed SMTP communication logs.

### 7. Alternative: Use Gmail SMTP (For Testing)

If Hostinger SMTP continues to have issues, you can temporarily use Gmail for testing:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not regular password
SMTP_SECURE=false
```

**Note:** Gmail requires App Passwords (not regular passwords). Generate one at: https://myaccount.google.com/apppasswords

### 8. Contact Support

If issues persist:

1. **Hostinger Support**
   - Contact Hostinger support about email delivery
   - Ask them to verify SPF/DKIM/DMARC records
   - Check if your account has email sending restrictions

2. **Check Email Logs**
   - Review detailed logs in terminal
   - Look for specific error codes
   - Share error messages with support

### 9. Verification Checklist

- [ ] SMTP_HOST is correct
- [ ] SMTP_PORT is 587 (or 465 for SSL)
- [ ] SMTP_USER matches the "from" email address exactly
- [ ] SMTP_PASS is correct (no extra spaces)
- [ ] Domain has SPF record configured
- [ ] Domain has DKIM configured (if available)
- [ ] Test email to different providers (Gmail, Yahoo, Outlook)
- [ ] Check spam folders
- [ ] Verify email is not blocked by recipient's provider
- [ ] Check Hostinger email panel for sent emails

### 10. Expected Behavior

When email sending works correctly, you should see:

```
📧 Preparing email with PDF receipt for: recipient@email.com
📧 Email configuration: { from: '...', to: '...', smtpHost: '...' }
📧 Sending email attempt 1/3 to recipient@email.com
📧 Email accepted by SMTP server: { messageId: '...', accepted: ['...'] }
✅ Donation receipt email sent successfully to: recipient@email.com
📧 Message ID: <message-id>
```

If you see `rejected` array with entries, those emails failed to send.

---

**Last Updated:** December 2, 2025

