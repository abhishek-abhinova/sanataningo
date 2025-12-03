const { promisePool } = require('../config/mysql-connection');

class Team {
  // Create new team member
  static async create(teamData) {
    const {
      name,
      designation,
      bio,
      photo_url,
      email,
      phone,
      social_links,
      display_order = 0,
      is_active = true
    } = teamData;

    const query = `
      INSERT INTO team_members (name, designation, bio, photo_url, email, phone, social_links, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const socialLinksJson = social_links ? JSON.stringify(social_links) : null;

    const [result] = await promisePool.query(query, [
      name, designation, bio, photo_url, email, phone, socialLinksJson, display_order, is_active
    ]);

    return this.findById(result.insertId);
  }

  // Find team member by ID
  static async findById(id) {
    const query = 'SELECT * FROM team_members WHERE id = ?';
    const [members] = await promisePool.query(query, [id]);
    if (members[0] && members[0].social_links) {
      members[0].social_links = JSON.parse(members[0].social_links);
    }
    return members[0] || null;
  }

  // Get all team members
  static async findAll(options = {}) {
    const { is_active, page = 1, limit = 20 } = options;

    let query = 'SELECT * FROM team_members WHERE 1=1';
    const params = [];

    if (typeof is_active !== 'undefined') {
      query += ' AND is_active = ?';
      params.push(is_active);
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [members] = await promisePool.query(query, params);

    // Parse social_links JSON
    members.forEach(member => {
      if (member.social_links) {
        member.social_links = JSON.parse(member.social_links);
      }
    });

    return members;
  }

  // Update team member
  static async update(id, teamData) {
    const updates = [];
    const values = [];

    const allowedFields = ['name', 'designation', 'bio', 'photo_url', 'email', 'phone', 'display_order', 'is_active'];

    allowedFields.forEach(field => {
      if (teamData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(teamData[field]);
      }
    });

    if (teamData.social_links !== undefined) {
      updates.push('social_links = ?');
      values.push(JSON.stringify(teamData.social_links));
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE team_members SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await promisePool.query(query, values);
    return this.findById(id);
  }

  // Delete team member
  static async delete(id) {
    const query = 'DELETE FROM team_members WHERE id = ?';
    await promisePool.query(query, [id]);
    return true;
  }
}

module.exports = Team;