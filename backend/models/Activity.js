const { promisePool } = require('../config/mysql-connection');

class Activity {
  // Create new activity
  static async create(activityData) {
    const {
      title,
      description,
      image_url,
      category,
      is_active = true,
      display_order = 0
    } = activityData;

    const query = `
      INSERT INTO activities (title, description, image_url, category, is_active, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await promisePool.query(query, [
      title, description, image_url, category, is_active, display_order
    ]);

    return this.findById(result.insertId);
  }

  // Find activity by ID
  static async findById(id) {
    const query = 'SELECT * FROM activities WHERE id = ?';
    const [activities] = await promisePool.query(query, [id]);
    return activities[0] || null;
  }

  // Get all activities
  static async findAll(options = {}) {
    const { category, is_active, page = 1, limit = 20 } = options;

    let query = 'SELECT * FROM activities WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (typeof is_active !== 'undefined') {
      query += ' AND is_active = ?';
      params.push(is_active);
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [activities] = await promisePool.query(query, params);
    return activities;
  }

  // Update activity
  static async update(id, activityData) {
    const updates = [];
    const values = [];

    const allowedFields = ['title', 'description', 'image_url', 'category', 'is_active', 'display_order'];

    allowedFields.forEach(field => {
      if (activityData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(activityData[field]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE activities SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await promisePool.query(query, values);
    return this.findById(id);
  }

  // Delete activity
  static async delete(id) {
    const query = 'DELETE FROM activities WHERE id = ?';
    await promisePool.query(query, [id]);
    return true;
  }
}

module.exports = Activity;