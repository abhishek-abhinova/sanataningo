#!/bin/bash

echo "🚀 Deploying Sarboshakti Sanatani Sangathan to GitHub..."
echo ""

echo "📦 Initializing Git repository..."
git init

echo "📝 Adding all files..."
git add .

echo "💾 Creating initial commit..."
git commit -m "Initial commit: Sarboshakti Sanatani Sangathan NGO Website

✨ Features:
- Complete React frontend with dark mode navbar
- Node.js backend with MongoDB integration
- Manual payment verification system
- Admin dashboard for member/donation management
- Email integration with Hostinger SMTP
- PDF generation for membership cards and receipts
- Responsive design for all devices
- Sanskrit blessings and spiritual content

🛡️ Admin Panel:
- Member verification and management
- Donation verification and receipt generation
- Contact form management
- Dashboard with statistics

📧 Email Features:
- Welcome emails for new members
- Donation receipts with tax information
- Contact form confirmations
- Professional HTML templates

🔧 Tech Stack:
- Frontend: React, Framer Motion, React Router
- Backend: Node.js, Express, MongoDB, Mongoose
- Email: Nodemailer with Hostinger SMTP
- PDF: Puppeteer for card/receipt generation
- Authentication: JWT for admin access"

echo "🌐 Adding remote repository..."
git remote add origin https://github.com/abhishek-abhinova/sanataningo.git

echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully deployed to GitHub!"
echo ""
echo "🔗 Repository URL: https://github.com/abhishek-abhinova/sanataningo.git"
echo ""
echo "📋 Next Steps:"
echo "1. Set up environment variables on your hosting platform"
echo "2. Deploy frontend to Netlify"
echo "3. Deploy backend to Render"
echo "4. Configure MongoDB Atlas connection"
echo "5. Set up Hostinger email SMTP"
echo ""