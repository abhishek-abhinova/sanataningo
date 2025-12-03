const { promisePool } = require('../config/mysql-connection');

class Media {
  // Create new media file
  static async create(mediaData) {
    const {
      title,
      description,
      file_url,
      file_type,
      file_size,
      mime_type,
      uploaded_by
    } = mediaData;

    const query = `
      INSERT INTO media (title, description, file_url, file_type, file_size, mime_type, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await promisePool.query(query, [
      title, description, file_url, file_type, file_size, mime_type, uploaded_by
    ]);

    return this.findById(result.insertId);
  }

  // Find media by ID
  static async findById(id) {
    const query = 'SELECT * FROM media WHERE id = ?';
    const [items] = await promisePool.query(query, [id]);
    return items[0] || null;
  }

  // Get all media files
  static async findAll(options = {}) {
    const { file_type, page = 1, limit = 20 } = options;

    let query = 'SELECT * FROM media WHERE 1=1';
    const params = [];

    if (file_type) {
      query += ' AND file_type = ?';
      params.push(file_type);
    }

    query += ' ORDER BY created_at DESC';

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [items] = await promisePool.query(query, params);
    return items;
  }

  // Update media file
  static async update(id, mediaData) {
    const updates = [];
    const values = [];

    const allowedFields = ['title', 'description', 'file_url', 'file_type', 'file_size', 'mime_type'];

    allowedFields.forEach(field => {
      if (mediaData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(mediaData[field]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE media SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await promisePool.query(query, values);
    return this.findById(id);
  }

  // Delete media file
  static async delete(id) {
    const query = 'DELETE FROM media WHERE id = ?';
    await promisePool.query(query, [id]);
    return true;
  }
}

module.exports = Media;