// Email configuration validator and helper
const validateEmailConfig = () => {
  const config = {
    isValid: false,
    errors: [],
    warnings: [],
    transporters: []
  };
  
  // Check primary SMTP configuration (Hostinger)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    config.transporters.push('Hostinger SMTP');
    
    if (!process.env.SMTP_HOST) {
      config.warnings.push('SMTP_HOST not set, using default smtp.hostinger.com');
    }
    
    if (!process.env.SMTP_PORT) {
      config.warnings.push('SMTP_PORT not set, using default 587');
    }
  } else {
    config.errors.push('Primary SMTP configuration missing: SMTP_USER and SMTP_PASS required');
  }
  
  // Check Gmail fallback configuration
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    config.transporters.push('Gmail SMTP');
  } else {
    config.warnings.push('Gmail fallback not configured: GMAIL_USER and GMAIL_PASS not set');
  }
  
  // Check organization details
  if (!process.env.ORG_EMAIL) {
    config.warnings.push('ORG_EMAIL not set - using SMTP_USER as fallback');
  }
  
  if (!process.env.ORG_NAME) {
    config.warnings.push('ORG_NAME not set - using default organization name');
  }
  
  // Determine if configuration is valid
  config.isValid = config.errors.length === 0 && config.transporters.length > 0;
  
  return config;
};

// Get email configuration summary
const getEmailConfigSummary = () => {
  const validation = validateEmailConfig();
  
  return {
    status: validation.isValid ? 'valid' : 'invalid',
    transporters: validation.transporters,
    errors: validation.errors,
    warnings: validation.warnings,
    settings: {
      smtpHost: process.env.SMTP_HOST || 'smtp.hostinger.com',
      smtpPort: process.env.SMTP_PORT || '587',
      smtpUser: process.env.SMTP_USER || 'Not set',
      orgEmail: process.env.ORG_EMAIL || 'Not set',
      orgName: process.env.ORG_NAME || 'Not set',
      hasGmailFallback: !!(process.env.GMAIL_USER && process.env.GMAIL_PASS)
    }
  };
};

// Recommended environment variables
const getRecommendedEnvVars = () => {
  return {
    required: [
      'SMTP_USER=your-email@yourdomain.com',
      'SMTP_PASS=your-email-password',
      'ORG_EMAIL=info@yourorganization.org',
      'ORG_NAME=Your Organization Name'
    ],
    optional: [
      'SMTP_HOST=smtp.hostinger.com',
      'SMTP_PORT=587',
      'GMAIL_USER=your-gmail@gmail.com',
      'GMAIL_PASS=your-gmail-app-password'
    ],
    notes: [
      'For Gmail, use App Password instead of regular password',
      'Ensure SMTP_USER matches your actual email provider',
      'Test configuration using /api/email-test/test-config endpoint'
    ]
  };
};

module.exports = {
  validateEmailConfig,
  getEmailConfigSummary,
  getRecommendedEnvVars
};