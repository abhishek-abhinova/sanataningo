const { promisePool } = require('../config/mysql-connection');

class Event {
  // Create new event
  static async create(eventData) {
    const {
      title,
      description,
      event_date,
      location,
      image_url,
      category,
      is_featured = false,
      status = 'upcoming',
      created_by
    } = eventData;

    const query = `
      INSERT INTO events (title, description, event_date, location, image_url, category, is_featured, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await promisePool.query(query, [
      title, description, event_date, location, image_url, category, is_featured, status, created_by
    ]);

    return this.findById(result.insertId);
  }

  // Find event by ID
  static async findById(id) {
    const query = 'SELECT * FROM events WHERE id = ?';
    const [events] = await promisePool.query(query, [id]);
    return events[0] || null;
  }

  // Get all events
  static async findAll(options = {}) {
    const { status, category, is_featured, page = 1, limit = 10 } = options;

    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (typeof is_featured !== 'undefined') {
      query += ' AND is_featured = ?';
      params.push(is_featured);
    }

    query += ' ORDER BY event_date DESC';

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [events] = await promisePool.query(query, params);
    return events;
  }

  // Update event
  static async update(id, eventData) {
    const updates = [];
    const values = [];

    const allowedFields = ['title', 'description', 'event_date', 'location', 'image_url', 'category', 'is_featured', 'status'];

    allowedFields.forEach(field => {
      if (eventData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(eventData[field]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE events SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await promisePool.query(query, values);
    return this.findById(id);
  }

  // Delete event
  static async delete(id) {
    const query = 'DELETE FROM events WHERE id = ?';
    await promisePool.query(query, [id]);
    return true;
  }

  // Get upcoming events
  static async getUpcoming(limit = 5) {
    const query = `
      SELECT * FROM events 
      WHERE status = 'upcoming' AND event_date >= CURDATE()
      ORDER BY event_date ASC 
      LIMIT ?
    `;
    const [events] = await promisePool.query(query, [limit]);
    return events;
  }
}

module.exports = Event;