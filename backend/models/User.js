const { promisePool } = require('../config/mysql-connection');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    const { name, email, password, role = 'admin' } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const query = `
      INSERT INTO users (name, email, password, role, is_active)
      VALUES (?, ?, ?, ?, TRUE)
    `;

    const [result] = await promisePool.query(query, [name, email, hashedPassword, role]);
    return { id: result.insertId, name, email, role };
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
    const [users] = await promisePool.query(query, [email.toLowerCase()]);
    return users[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ? AND is_active = TRUE';
    const [users] = await promisePool.query(query, [id]);
    return users[0] || null;
  }

  // Get all users
  static async findAll() {
    const query = 'SELECT id, name, email, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC';
    const [users] = await promisePool.query(query);
    return users;
  }

  // Update user
  static async update(id, userData) {
    const updates = [];
    const values = [];

    if (userData.name) {
      updates.push('name = ?');
      values.push(userData.name);
    }
    if (userData.email) {
      updates.push('email = ?');
      values.push(userData.email.toLowerCase());
    }
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      updates.push('password = ?');
      values.push(hashedPassword);
    }
    if (userData.role) {
      updates.push('role = ?');
      values.push(userData.role);
    }
    if (typeof userData.is_active !== 'undefined') {
      updates.push('is_active = ?');
      values.push(userData.is_active);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await promisePool.query(query, values);
    return this.findById(id);
  }

  // Delete user (soft delete)
  static async delete(id) {
    const query = 'UPDATE users SET is_active = FALSE WHERE id = ?';
    await promisePool.query(query, [id]);
    return true;
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update last login
  static async updateLastLogin(id) {
    const query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await promisePool.query(query, [id]);
  }
}

module.exports = User;