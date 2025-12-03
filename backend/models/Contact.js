const { promisePool } = require('../config/mysql-connection');

class Contact {
  // Create new contact submission
  static async create(contactData) {
    const { name, email, phone, subject, message } = contactData;

    const query = `
      INSERT INTO contacts (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `;

    const [result] = await promisePool.query(query, [name, email, phone, subject, message]);
    return this.findById(result.insertId);
  }

  // Find contact by ID
  static async findById(id) {
    const query = 'SELECT * FROM contacts WHERE id = ?';
    const [contacts] = await promisePool.query(query, [id]);
    return contacts[0] || null;
  }

  // Get all contacts with pagination and filters
  static async findAll(options = {}) {
    const { page = 1, limit = 10, status, search } = options;

    let query = 'SELECT * FROM contacts WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [contacts] = await promisePool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM contacts WHERE 1=1';
    const countParams = params.slice(0, -2);

    if (status) countQuery += ' AND status = ?';
    if (search) countQuery += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ?)';

    const [countResult] = await promisePool.query(countQuery, countParams);
    const total = countResult[0].total;

    return {
      contacts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Update contact
  static async update(id, contactData) {
    const updates = [];
    const values = [];

    const allowedFields = ['status', 'replied_at', 'replied_by', 'reply_message'];

    allowedFields.forEach(field => {
      if (contactData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(contactData[field]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE contacts SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await promisePool.query(query, values);
    return this.findById(id);
  }

  // Mark as read
  static async markAsRead(id) {
    const query = 'UPDATE contacts SET status = "read", updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await promisePool.query(query, [id]);
    return this.findById(id);
  }

  // Delete contact
  static async delete(id) {
    const query = 'DELETE FROM contacts WHERE id = ?';
    await promisePool.query(query, [id]);
    return true;
  }

  // Get statistics
  static async getStatistics() {
    const queries = {
      total: 'SELECT COUNT(*) as count FROM contacts',
      new: 'SELECT COUNT(*) as count FROM contacts WHERE status = "new"',
      replied: 'SELECT COUNT(*) as count FROM contacts WHERE status = "replied"',
      recent: 'SELECT COUNT(*) as count FROM contacts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    };

    const [total] = await promisePool.query(queries.total);
    const [newContacts] = await promisePool.query(queries.new);
    const [replied] = await promisePool.query(queries.replied);
    const [recent] = await promisePool.query(queries.recent);

    return {
      total: total[0].count,
      new: newContacts[0].count,
      replied: replied[0].count,
      recent: recent[0].count
    };
  }
}

module.exports = Contact;