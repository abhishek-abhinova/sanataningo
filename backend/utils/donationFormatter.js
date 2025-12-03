const sanitizeString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : fallback;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : fallback;
  }

  return `${value}`.trim() || fallback;
};

const parseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const parseDate = (value) => {
  if (!value) {
    return new Date();
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const buildReceiptNumber = (donation) => {
  const fallback = donation && (donation.id || donation._id)
    ? `DON${String(donation.id || donation._id).padStart(6, '0')}`
    : `DON-${Date.now()}`;

  return sanitizeString(
    donation.receipt_number ||
    donation.receiptNumber ||
    donation.donationId ||
    donation.payment_id ||
    donation.transaction_id ||
    fallback,
    fallback
  );
};

const normalizeDonationData = (donation = {}) => {
  const donorName = sanitizeString(
    donation.donorName ||
    donation.donor_name ||
    donation.name ||
    donation.fullName ||
    donation.donor,
    donation.is_anonymous ? 'Anonymous Donor' : 'Valued Donor'
  );

  const email = sanitizeString(
    donation.email ||
    donation.donorEmail ||
    donation.contactEmail,
    ''
  );

  const phone = sanitizeString(
    donation.phone ||
    donation.contactNumber ||
    donation.mobile ||
    donation.donorPhone,
    ''
  );

  const address = sanitizeString(
    donation.address ||
    donation.donor_address ||
    donation.billingAddress ||
    donation.city ||
    donation.state,
    'Not provided'
  );

  const purpose = sanitizeString(
    donation.purpose ||
    donation.donation_type ||
    donation.donationType ||
    donation.message,
    'General Donation'
  );

  const paymentReference = sanitizeString(
    donation.paymentReference ||
    donation.payment_id ||
    donation.paymentId ||
    donation.razorpay_payment_id ||
    donation.transaction_id ||
    donation.transactionId ||
    donation.upiReference,
    ''
  );

  const amount = parseNumber(
    donation.amount ||
    donation.amount_inr ||
    donation.totalAmount ||
    donation.value
  );

  const receiptNumber = buildReceiptNumber(donation);
  const donationDate = parseDate(
    donation.donationDate ||
    donation.donation_date ||
    donation.created_at ||
    donation.createdAt ||
    donation.updated_at
  );

  return {
    ...donation,
    donorName,
    email,
    phone,
    address,
    purpose,
    paymentReference,
    amount,
    amountFormatted: amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    receiptNumber,
    donationId: receiptNumber,
    donationDate,
    donationDateFormatted: donationDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  };
};

module.exports = {
  normalizeDonationData
};

