# Render Email Setup Instructions

## Problem
Render servers block SMTP connections to external providers like Hostinger, causing email timeouts.

## Solution
Use Gmail SMTP which is allowed by Render.

## Setup Steps

### 1. Create Gmail App Password
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > App passwords
4. Generate app password for "Mail"
5. Copy the 16-digit password

### 2. Set Render Environment Variables
In your Render dashboard, add these environment variables:

```
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password
```

### 3. Test Email Service
```bash
POST https://sarboshakti-backend.onrender.com/api/render-email/send
{
  "to": "test@example.com",
  "subject": "Test Email"
}
```

### 4. Update Email Functions
The system will automatically use Gmail SMTP when deployed on Render.

## Email Services Available
- Member approval emails
- Donation receipts  
- Contact form notifications
- Admin notifications

## Fallback
If Gmail is not configured, system uses Ethereal test emails (preview only).