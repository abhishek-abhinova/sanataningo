const { promisePool } = require('../config/mysql-connection');

class Donation {
  // Generate unique receipt number
  static async generateReceiptNumber() {
    // Find the max receipt number and increment
    const [result] = await promisePool.query("SELECT MAX(receipt_number) as max_receipt FROM donations");
    let nextNum = 1;
    if (result[0].max_receipt) {
      // Extract the numeric part
      const match = result[0].max_receipt.match(/DON(\d{6})/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    return `DON${String(nextNum).padStart(6, '0')}`;
  }

  // Create new donation
  static async create(donationData) {
    const {
      donor_name,
      email,
      phone,
      amount,
      donation_type = 'general',
      message,
      is_anonymous = false,
      payment_status = 'pending',
      payment_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      pan_number,
      tax_benefit = true
    } = donationData;

    // Generate receipt number
    const receipt_number = await this.generateReceiptNumber();

    const query = `
      INSERT INTO donations (
        receipt_number, donor_name, email, phone, amount, donation_type, message,
        is_anonymous, payment_status, payment_id, razorpay_order_id, razorpay_payment_id,
        razorpay_signature, pan_number, tax_benefit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await promisePool.query(query, [
      receipt_number, donor_name, email, phone, amount, donation_type, message,
      is_anonymous, payment_status, payment_id, razorpay_order_id, razorpay_payment_id,
      razorpay_signature, pan_number, tax_benefit
    ]);

    return this.findById(result.insertId);
  }

  // Find donation by ID
  static async findById(id) {
    const query = 'SELECT * FROM donations WHERE id = ?';
    const [donations] = await promisePool.query(query, [id]);
    return donations[0] || null;
  }

  // Find donation by receipt number
  static async findByReceiptNumber(receipt_number) {
    const query = 'SELECT * FROM donations WHERE receipt_number = ?';
    const [donations] = await promisePool.query(query, [receipt_number]);
    return donations[0] || null;
  }

  // Get all donations with pagination and filters
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      donation_type,
      payment_status,
      search,
      start_date,
      end_date
    } = options;

    let query = 'SELECT * FROM donations WHERE 1=1';
    const params = [];

    if (donation_type) {
      query += ' AND donation_type = ?';
      params.push(donation_type);
    }

    if (payment_status) {
      query += ' AND payment_status = ?';
      params.push(payment_status);
    }

    if (search) {
      query += ' AND (donor_name LIKE ? OR email LIKE ? OR phone LIKE ? OR receipt_number LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (start_date) {
      query += ' AND created_at >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND created_at <= ?';
      params.push(end_date);
    }

    query += ' ORDER BY created_at DESC';

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [donations] = await promisePool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM donations WHERE 1=1';
    const countParams = params.slice(0, -2); // Remove limit and offset

    if (donation_type) countQuery += ' AND donation_type = ?';
    if (payment_status) countQuery += ' AND payment_status = ?';
    if (search) countQuery += ' AND (donor_name LIKE ? OR email LIKE ? OR phone LIKE ? OR receipt_number LIKE ?)';
    if (start_date) countQuery += ' AND created_at >= ?';
    if (end_date) countQuery += ' AND created_at <= ?';

    const [countResult] = await promisePool.query(countQuery, countParams);
    const total = countResult[0].total;

    return {
      donations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Update donation
  static async update(id, donationData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      'donor_name', 'email', 'phone', 'amount', 'donation_type', 'message',
      'is_anonymous', 'payment_status', 'payment_id', 'razorpay_order_id',
      'razorpay_payment_id', 'razorpay_signature', 'receipt_url', 'pan_number', 'tax_benefit'
    ];

    allowedFields.forEach(field => {
      if (donationData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(donationData[field]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE donations SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await promisePool.query(query, values);
    return this.findById(id);
  }

  // Delete donation
  static async delete(id) {
    const query = 'DELETE FROM donations WHERE id = ?';
    await promisePool.query(query, [id]);
    return true;
  }

  // Update payment status
  static async updatePaymentStatus(id, paymentData) {
    const {
      payment_status,
      razorpay_payment_id,
      razorpay_signature
    } = paymentData;

    const query = `
      UPDATE donations 
      SET payment_status = ?, razorpay_payment_id = ?, razorpay_signature = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await promisePool.query(query, [payment_status, razorpay_payment_id, razorpay_signature, id]);
    return this.findById(id);
  }

  // Get statistics
  static async getStatistics() {
    const queries = {
      total: 'SELECT COUNT(*) as count, SUM(amount) as total_amount FROM donations WHERE payment_status = "completed"',
      byType: 'SELECT donation_type, COUNT(*) as count, SUM(amount) as total_amount FROM donations WHERE payment_status = "completed" GROUP BY donation_type',
      byPaymentStatus: 'SELECT payment_status, COUNT(*) as count, SUM(amount) as total_amount FROM donations GROUP BY payment_status',
      recent: 'SELECT COUNT(*) as count, SUM(amount) as total_amount FROM donations WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND payment_status = "completed"',
      thisMonth: 'SELECT COUNT(*) as count, SUM(amount) as total_amount FROM donations WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) AND payment_status = "completed"'
    };

    const [total] = await promisePool.query(queries.total);
    const [byType] = await promisePool.query(queries.byType);
    const [byPaymentStatus] = await promisePool.query(queries.byPaymentStatus);
    const [recent] = await promisePool.query(queries.recent);
    const [thisMonth] = await promisePool.query(queries.thisMonth);

    return {
      totalDonations: total[0].count || 0,
      totalAmount: total[0].total_amount || 0,
      byType,
      byPaymentStatus,
      recentDonations: recent[0].count || 0,
      recentAmount: recent[0].total_amount || 0,
      thisMonthDonations: thisMonth[0].count || 0,
      thisMonthAmount: thisMonth[0].total_amount || 0
    };
  }
}

module.exports = Donation;