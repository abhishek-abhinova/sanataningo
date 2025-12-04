# Alternative Email Configuration for Gmail (Backup)

If Hostinger SMTP continues to timeout, use Gmail as backup:

## Gmail SMTP Configuration:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
```

## Steps to Setup Gmail SMTP:
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in SMTP_PASS

## Alternative SMTP Providers:
- **SendGrid**: smtp.sendgrid.net (Port 587)
- **Mailgun**: smtp.mailgun.org (Port 587)  
- **Amazon SES**: email-smtp.region.amazonaws.com (Port 587)

## Current Issue:
Hostinger SMTP is timing out on connection. This could be due to:
1. Firewall blocking SMTP ports on Render
2. Hostinger SMTP server issues
3. Network connectivity problems

## Quick Fix:
Update Render environment variables to use Gmail SMTP temporarily.