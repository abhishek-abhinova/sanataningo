# Email Setup Guide

## Quick Setup for technowebs.in Email

### Step 1: Create/Update `.env` file in `backend/` directory

Create a file named `.env` in the `backend/` folder with the following content:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=your-mongodb-connection-string

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (SMTP) - REQUIRED
# For technowebs.in domain (likely Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=partha@technowebs.in
SMTP_PASS=alyxwqfkxlrjnwjr

# Organization Details
ORG_NAME=Sarbo Shakti Sonatani Sangathan
ORG_ADDRESS=19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, UP-231301
ORG_EMAIL=partha@technowebs.in
ORG_PHONE=+91 9876543210

# Razorpay Configuration (Optional)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### Step 2: Restart Backend Server

After updating the `.env` file, restart your backend server:

```bash
cd backend
npm start
```

Or if using nodemon:
```bash
npm run dev
```

### Step 3: Test Email Configuration

Test if your SMTP configuration is correct:

**Option 1: Using Browser**
Visit: `http://localhost:5000/api/test/test-smtp-config`

**Option 2: Using curl**
```bash
curl http://localhost:5000/api/test/test-smtp-config
```

**Option 3: Using Postman/Thunder Client**
- Method: GET
- URL: `http://localhost:5000/api/test/test-smtp-config`

### Step 4: Test Sending Donation Receipt Email

Test sending a donation receipt with PDF:

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/test/test-donation-receipt-pdf \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com"}'
```

**Using Postman/Thunder Client:**
- Method: POST
- URL: `http://localhost:5000/api/test/test-donation-receipt-pdf`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "your-test-email@gmail.com"
}
```

### Important Notes:

1. **SMTP Server**: If `smtp.hostinger.com` doesn't work, try:
   - `smtp.titan.email` (if using Titan email)
   - `smtp.gmail.com` (if using Gmail/Google Workspace)
   - Check your email provider's documentation for SMTP settings

2. **From Address**: The "from" address MUST match `SMTP_USER` exactly. The system will automatically use `partha@technowebs.in` as the sender.

3. **Port**: 
   - Port `587` is for STARTTLS (recommended)
   - Port `465` is for SSL (set `SMTP_SECURE=true` if using this)

4. **Password**: Make sure there are no extra spaces in the password in your `.env` file.

### Troubleshooting

#### If SMTP test fails:

1. **Check SMTP Host**: Verify your email provider's SMTP server:
   - Hostinger: `smtp.hostinger.com`
   - Gmail: `smtp.gmail.com`
   - Outlook: `smtp-mail.outlook.com`

2. **Check Credentials**: 
   - Verify email: `partha@technowebs.in`
   - Verify password: `alyxwqfkxlrjnwjr` (no spaces)

3. **Check Port**:
   - Try port `587` first (STARTTLS)
   - If that fails, try port `465` with `SMTP_SECURE=true`

4. **Check Firewall**: Make sure port 587 or 465 is not blocked

#### If email sends but not received:

1. **Check Spam Folder**: Emails might be going to spam
2. **Check Email Provider**: Some providers block emails from new domains
3. **Check DNS Records**: Ensure SPF, DKIM, and DMARC records are set up
4. **Check Sent Folder**: Log into your email account and check the "Sent" folder

### Verification Checklist

- [ ] `.env` file created in `backend/` directory
- [ ] `SMTP_USER` set to `partha@technowebs.in`
- [ ] `SMTP_PASS` set to `alyxwqfkxlrjnwjr`
- [ ] `SMTP_HOST` set correctly (likely `smtp.hostinger.com`)
- [ ] `SMTP_PORT` set to `587`
- [ ] Backend server restarted after `.env` changes
- [ ] SMTP test endpoint returns success
- [ ] Test email sent successfully

### Next Steps

After setting up the email configuration:

1. Test sending a donation receipt from the admin panel
2. Check terminal logs for detailed email sending information
3. Verify emails are being received (check spam folder too)
4. If emails still don't arrive, check the troubleshooting section above

---

**Last Updated:** December 2, 2025

