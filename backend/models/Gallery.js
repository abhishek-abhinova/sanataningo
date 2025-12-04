const { promisePool } = require('../config/mysql-connection');

class Gallery {
  // Create new gallery image
  static async create(galleryData) {
    const {
      title,
      description,
      image_url,
      image_data,
      thumbnail_url,
      category,
      display_order = 0,
      is_active = true,
      uploaded_by
    } = galleryData;

    const query = `
      INSERT INTO gallery (title, description, image_url, image_data, thumbnail_url, category, display_order, is_active, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await promisePool.query(query, [
      title, description, image_url, image_data, thumbnail_url, category, display_order, is_active, uploaded_by
    ]);

    return this.findById(result.insertId);
  }

  // Find gallery item by ID
  static async findById(id) {
    const query = 'SELECT * FROM gallery WHERE id = ?';
    const [items] = await promisePool.query(query, [id]);
    return items[0] || null;
  }

  // Get all gallery items
  static async findAll(options = {}) {
    const { category, is_active, page = 1, limit = 20 } = options;

    let query = 'SELECT * FROM gallery WHERE 1=1';
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

    const [items] = await promisePool.query(query, params);
    return items;
  }

  // Update gallery item
  static async update(id, galleryData) {
    const updates = [];
    const values = [];

    const allowedFields = ['title', 'description', 'image_url', 'image_data', 'thumbnail_url', 'category', 'display_order', 'is_active'];

    allowedFields.forEach(field => {
      if (galleryData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(galleryData[field]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE gallery SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await promisePool.query(query, values);
    return this.findById(id);
  }

  // Delete gallery item
  static async delete(id) {
    const query = 'DELETE FROM gallery WHERE id = ?';
    await promisePool.query(query, [id]);
    return true;
  }
}

module.exports = Gallery;