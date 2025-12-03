const { promisePool } = require('../config/mysql-connection');

class Member {
  // Generate unique member ID
  static async generateMemberId() {
    const [result] = await promisePool.query('SELECT COUNT(*) as count FROM members');
    const count = result[0].count;
    return `SSS${String(count + 1).padStart(6, '0')}`;
  }

  // Create new member
  static async create(memberData) {
    const {
      full_name,
      email,
      phone,
      date_of_birth,
      address,
      city,
      state,
      pincode,
      aadhaar_number,
      aadhaar_front_image,
      aadhaar_back_image,
      membership_type,
      membership_fee,
      payment_status = 'pending',
      payment_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = memberData;

    // Generate member ID
    const member_id = await this.generateMemberId();

    const query = `
      INSERT INTO members (
        member_id, full_name, email, phone, date_of_birth, address, city, state, pincode,
        aadhaar_number, aadhaar_front_image, aadhaar_back_image, membership_type, membership_fee,
        payment_status, payment_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const [result] = await promisePool.query(query, [
      member_id, full_name, email, phone, date_of_birth, address, city, state, pincode,
      aadhaar_number, aadhaar_front_image, aadhaar_back_image, membership_type, membership_fee,
      payment_status, payment_id, razorpay_order_id, razorpay_payment_id, razorpay_signature
    ]);

    return this.findById(result.insertId);
  }

  // Find member by ID
  static async findById(id) {
    const query = 'SELECT * FROM members WHERE id = ?';
    const [members] = await promisePool.query(query, [id]);
    return members[0] || null;
  }

  // Find member by member_id
  static async findByMemberId(member_id) {
    const query = 'SELECT * FROM members WHERE member_id = ?';
    const [members] = await promisePool.query(query, [member_id]);
    return members[0] || null;
  }

  // Find member by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM members WHERE email = ?';
    const [members] = await promisePool.query(query, [email]);
    return members[0] || null;
  }

  // Get all members with pagination and filters
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      membership_type,
      payment_status,
      search
    } = options;

    let query = 'SELECT * FROM members WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (membership_type) {
      query += ' AND membership_type = ?';
      params.push(membership_type);
    }

    if (payment_status) {
      query += ' AND payment_status = ?';
      params.push(payment_status);
    }

    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR member_id LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [members] = await promisePool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM members WHERE 1=1';
    const countParams = params.slice(0, -2); // Remove limit and offset

    if (status) countQuery += ' AND status = ?';
    if (membership_type) countQuery += ' AND membership_type = ?';
    if (payment_status) countQuery += ' AND payment_status = ?';
    if (search) countQuery += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR member_id LIKE ?)';

    const [countResult] = await promisePool.query(countQuery, countParams);
    const total = countResult[0].total;

    return {
      members,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Update member
  static async update(id, memberData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      'full_name', 'email', 'phone', 'date_of_birth', 'address', 'city', 'state', 'pincode',
      'aadhaar_number', 'aadhaar_front_image', 'aadhaar_back_image', 'membership_type',
      'membership_fee', 'payment_status', 'payment_id', 'razorpay_order_id',
      'razorpay_payment_id', 'razorpay_signature', 'membership_card_url', 'status'
    ];

    allowedFields.forEach(field => {
      if (memberData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(memberData[field]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE members SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await promisePool.query(query, values);
    return this.findById(id);
  }

  // Delete member (soft delete)
  static async delete(id) {
    const query = 'UPDATE members SET status = "inactive" WHERE id = ?';
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
      UPDATE members 
      SET payment_status = ?, razorpay_payment_id = ?, razorpay_signature = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await promisePool.query(query, [payment_status, razorpay_payment_id, razorpay_signature, id]);
    return this.findById(id);
  }

  // Get statistics
  static async getStatistics() {
    const queries = {
      total: 'SELECT COUNT(*) as count FROM members',
      active: 'SELECT COUNT(*) as count FROM members WHERE status = "active"',
      byType: 'SELECT membership_type, COUNT(*) as count FROM members GROUP BY membership_type',
      byPaymentStatus: 'SELECT payment_status, COUNT(*) as count FROM members GROUP BY payment_status',
      recent: 'SELECT COUNT(*) as count FROM members WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    };

    const [total] = await promisePool.query(queries.total);
    const [active] = await promisePool.query(queries.active);
    const [byType] = await promisePool.query(queries.byType);
    const [byPaymentStatus] = await promisePool.query(queries.byPaymentStatus);
    const [recent] = await promisePool.query(queries.recent);

    return {
      total: total[0].count,
      active: active[0].count,
      byType,
      byPaymentStatus,
      recentMembers: recent[0].count
    };
  }
}

module.exports = Member;