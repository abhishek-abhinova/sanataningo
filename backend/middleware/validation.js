const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Member validation rules
const memberValidation = [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number is required'),
  body('address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('occupation').trim().isLength({ min: 2 }).withMessage('Occupation is required'),
  body('membershipType').isIn(['basic', 'premium', 'lifetime']).withMessage('Invalid membership type'),
  body('aadhaarNumber').matches(/^[0-9]{12}$/).withMessage('Valid 12-digit Aadhaar number is required')
];

// Donation validation rules
const donationValidation = [
  body('donorName').trim().isLength({ min: 2 }).withMessage('Donor name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number is required'),
  body('address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least ₹1'),
  body('purpose').isIn(['general', 'education', 'healthcare', 'disaster_relief', 'cultural_programs']).withMessage('Invalid purpose')
];

// Contact validation rules
const contactValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number is required'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
];

module.exports = {
  handleValidationErrors,
  memberValidation,
  donationValidation,
  contactValidation
};