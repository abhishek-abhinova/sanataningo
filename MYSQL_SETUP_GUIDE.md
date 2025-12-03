# MySQL Database Setup Guide

This guide will help you set up MySQL database for the Sarboshakti Sanatani Sangathan NGO website.

## Prerequisites

You need to have MySQL installed on your system. Here are the recommended options:

### Option 1: XAMPP (Recommended for Beginners)
1. Download XAMPP from: https://www.apachefriends.org/
2. Install XAMPP with MySQL and phpMyAdmin
3. Start Apache and MySQL services from XAMPP Control Panel

### Option 2: Standalone MySQL
1. Download MySQL Community Server: https://dev.mysql.com/downloads/mysql/
2. Install MySQL Server
3. Set up root password during installation

###Option 3: WAMP (Windows)
1. Download WAMP: https://www.wampserver.com/
2. Install WAMP which includes MySQL and phpMyAdmin

## Step 1: Start MySQL Service

### Using XAMPP:
1. Open XAMPP Control Panel
2. Click "Start" button for MySQL
3. Click "Admin" button for MySQL to open phpMyAdmin
4. phpMyAdmin should open at: `http://localhost/phpmyadmin`

### Using Standalone MySQL:
```bash
# Start MySQL service (Windows)
net start MySQL80

# Start MySQL service (Linux/Mac)
sudo service mysql start
```

## Step 2: Create Database

### Method A: Using phpMyAdmin (Easiest)
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click on "New" in the left sidebar
3. Enter database name: `sarboshakti_ngo`
4. Select collation: `utf8mb4_unicode_ci`
5. Click "Create"

### Method B: Using MySQL Command Line
```sql
mysql -u root -p
CREATE DATABASE sarboshakti_ngo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sarboshakti_ngo;
```

## Step 3: Import Database Schema

### Method A: Using phpMyAdmin
 1. Open phpMyAdmin
2. Select `sarboshakti_ngo` database from left sidebar
3. Click on "Import" tab
4. Click "Choose File"
5. Select: `backend/config/database-schema.sql`
6. Click "Go" at the bottom
7. Wait for success message

### Method B: Using MySQL Command Line
```bash
cd backend
mysql -u root -p sarboshakti_ngo < config/database-schema.sql
```

### Method C: Using Node.js Script (Recommended)
```bash
cd backend
npm install
node config/init-mysql-db.js
```

## Step 4: Configure Environment Variables

1. Navigate to `backend` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` file and update:
   ```env
   # MySQL Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=         # Your MySQL root password (leave empty if no password)
   DB_NAME=sarboshakti_ngo
   DB_PORT=3306

   # Server Configuration
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345

   # Email Configuration (Optional - for sending emails)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # Razorpay Configuration (Optional - for payments)
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret

   # Organization Details
   ORG_NAME=Sarbo Shakti Sonatani Sangathan
   ORG_ADDRESS=K-11, S/F, Gali No. 6, Old Gobind Pura, Delhi — 110051, India
   ORG_EMAIL=info@sarboshakti.org
   ORG_PHONE=+91 XXXXX XXXXX
   ```

## Step 5: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `mysql2` - MySQL database driver
- All other required packages

## Step 6: Verify Database Setup

### Check Tables Created
1. Open phpMyAdmin
2. Select `sarboshakti_ngo` database
3. You should see these tables:
   - `users`
   - `members`
   - `donations`
   - `contacts`
   - `gallery`
   - `media`
   - `team_members`
   - `events`
   - `activities`
   - `transactions`
   - `settings`

### Verify Admin Account
1. Click on `users` table
2. You should see one admin user with email: `admin@sarboshakti.org`

## Step 7: Start Backend Server

```bash
cd backend
npm run dev
```

Or for production:
```bash
npm start
```

The server should start on `http://localhost:5000`

## Step 8: Test API Connection

### Test Health Endpoint
Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-12-01T...",
  "database": "Connected",
  "databaseType": "MySQL",
  "environment": "development",
  "version": "2.0.0"
}
```

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sarboshakti.org",
    "password": "admin123"
  }'
```

Expected response: JWT token and user object

## Step 9: Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend should start on `http://localhost:3000`

## Default Admin Credentials

**Email:** `admin@sarboshakti.org`  
**Password:** `admin123`

> **⚠️ IMPORTANT:** Change the admin password after first login!

## Troubleshooting

### Error: "Access denied for user"
- Check your MySQL root password in `.env` file
- Make sure MySQL service is running
- Try resetting MySQL root password

### Error: "Database 'sarboshakti_ngo' doesn't exist"
- Create the database using phpMyAdmin or command line
- Run the schema import again

### Error: "Cannot connect to MySQL"
- Make sure MySQL service is running in XAMPP
- Check if port 3306 is not blocked
- Verify DB_HOST is set to `localhost` in `.env`

### Error: "ER_NOT_SUPPORTED_AUTH_MODE"
- This happens with MySQL 8+
- Run this SQL command:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
  FLUSH PRIVILEGES;
  ```

### Tables not creating
- Make sure you selected the correct database
- Check SQL file syntax
- Use Node.js script: `node config/init-mysql-db.js`

## Accessing phpMyAdmin

- **URL:** `http://localhost/phpmyadmin`
- **Username:** `root`
- **Password:** (your MySQL root password, might be empty)

## Database Management

### Backup Database
```bash
mysqldump -u root -p sarboshakti_ngo > backup.sql
```

### Restore Database
```bash
mysql -u root -p sarboshakti_ngo < backup.sql
```

### Reset Database
```bash
cd backend
node config/init-mysql-db.js
```

## Next Steps

1. ✅ MySQL installed and running
2. ✅ Database created
3. ✅ Schema imported
4. ✅ Environment variables configured
5. ✅ Backend server running
6. ✅ Frontend server running
7. ✅ Admin login working

Now you can:
- Access admin panel at: `http://localhost:3000/admin`
- Register members
- Accept donations
- Manage gallery
- View contacts

## Support

If you encounter any issues:
1. Check MySQL error logs in XAMPP
2. Check backend console for errors
3. Verify all environment variables are set correctly
4. Make sure all services are running

---

**Database Type:** MySQL (phpMyAdmin)  
**Backend:** Node.js + Express + MySQL2  
**Frontend:** React

🎉 **Your MySQL database is now ready!**
