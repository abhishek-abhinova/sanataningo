-- Sarboshakti Sanatani Sangathan Database Schema
-- MySQL Database Schema for NGO Management System

-- Drop existing database if exists (use with caution)
-- DROP DATABASE IF EXISTS sarboshakti_ngo;

-- Create database
CREATE DATABASE IF NOT EXISTS sarboshakti_ngo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sarboshakti_ngo;

-- =====================================================
-- Users Table (Admin Users)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'superadmin') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Members Table (NGO Members)
-- =====================================================
CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date_of_birth DATE,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  aadhaar_number VARCHAR(12),
  aadhaar_front_image VARCHAR(500),
  aadhaar_back_image VARCHAR(500),
  membership_type ENUM('basic', 'premium', 'lifetime') DEFAULT 'basic',
  membership_fee DECIMAL(10, 2) DEFAULT 0.00,
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(500),
  membership_card_url VARCHAR(500),
  member_id VARCHAR(50) UNIQUE,
  joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_member_id (member_id),
  INDEX idx_payment_status (payment_status),
  INDEX idx_membership_type (membership_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Donations Table
-- =====================================================
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  donation_type ENUM('general', 'education', 'health', 'temple', 'other') DEFAULT 'general',
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(500),
  receipt_url VARCHAR(500),
  receipt_number VARCHAR(50) UNIQUE,
  pan_number VARCHAR(10),
  tax_benefit BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_payment_status (payment_status),
  INDEX idx_receipt_number (receipt_number),
  INDEX idx_donation_type (donation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Contacts Table (Contact Form Submissions)
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
  replied_at TIMESTAMP NULL,
  replied_by INT,
  reply_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Gallery Table (Image Gallery)
-- =====================================================
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  category VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Media Table (Media Files)
-- =====================================================
CREATE TABLE IF NOT EXISTS media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_type ENUM('image', 'video', 'document', 'other') DEFAULT 'image',
  file_size INT,
  mime_type VARCHAR(100),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_file_type (file_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Team Members Table
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  bio TEXT,
  photo_url VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(20),
  social_links JSON,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Events Table
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATETIME NOT NULL,
  location VARCHAR(255),
  image_url VARCHAR(500),
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT FALSE,
  status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_event_date (event_date),
  INDEX idx_status (status),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Activities Table
-- =====================================================
CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Transactions Table (Payment Tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(500),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status ENUM('created', 'authorized', 'captured', 'refunded', 'failed') DEFAULT 'created',
  transaction_type ENUM('membership', 'donation') NOT NULL,
  reference_id INT,
  payer_name VARCHAR(255),
  payer_email VARCHAR(255),
  payer_phone VARCHAR(20),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_status (status),
  INDEX idx_transaction_type (transaction_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Settings Table (System Settings)
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_setting_key (setting_key),
  INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Insert Default Admin User
-- Password: admin123 (hashed with bcrypt)
-- =====================================================
INSERT INTO users (name, email, password, role, is_active) VALUES
('Admin', 'admin@sarboshakti.org', '$2a$10$rBV2KU5fFZRe4jZHN5pLwO7aEGbxJLhYJ8qZV7qJFQf.Qy2YQKWnu', 'superadmin', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- =====================================================
-- Insert Default Settings
-- =====================================================
INSERT INTO settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('org_name', 'Sarbo Shakti Sonatani Sangathan', 'string', 'Organization Name', TRUE),
('org_email', 'info@sarboshakti.org', 'string', 'Organization Email', TRUE),
('org_phone', '+91 XXXXX XXXXX', 'string', 'Organization Phone', TRUE),
('org_address', 'K-11, S/F, Gali No. 6, Old Gobind Pura, Delhi — 110051, India', 'string', 'Organization Address', TRUE),
('membership_basic_fee', '100', 'number', 'Basic Membership Fee', TRUE),
('membership_premium_fee', '500', 'number', 'Premium Membership Fee', TRUE),
('membership_lifetime_fee', '2000', 'number', 'Lifetime Membership Fee', TRUE)
ON DUPLICATE KEY UPDATE setting_value=setting_value;

-- =====================================================
-- End of Schema
-- =====================================================
