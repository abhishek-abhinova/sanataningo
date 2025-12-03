const { promisePool } = require('../config/mysql-connection');

class Settings {
  // Create or update setting
  static async set(key, value, type = 'string', description = '', isPublic = false) {
    const query = `
      INSERT INTO settings (setting_key, setting_value, setting_type, description, is_public)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        setting_value = VALUES(setting_value),
        setting_type = VALUES(setting_type),
        description = VALUES(description),
        is_public = VALUES(is_public),
        updated_at = CURRENT_TIMESTAMP
    `;

    await promisePool.query(query, [key, value, type, description, isPublic]);
    return this.get(key);
  }

  // Get setting by key
  static async get(key) {
    const query = 'SELECT * FROM settings WHERE setting_key = ?';
    const [settings] = await promisePool.query(query, [key]);

    if (!settings[0]) return null;

    const setting = settings[0];

    // Parse value based on type
    if (setting.setting_type === 'number') {
      setting.setting_value = parseFloat(setting.setting_value);
    } else if (setting.setting_type === 'boolean') {
      setting.setting_value = setting.setting_value === 'true' || setting.setting_value === '1';
    } else if (setting.setting_type === 'json') {
      setting.setting_value = JSON.parse(setting.setting_value);
    }

    return setting;
  }

  // Get all settings
  static async getAll(publicOnly = false) {
    let query = 'SELECT * FROM settings';

    if (publicOnly) {
      query += ' WHERE is_public = TRUE';
    }

    query += ' ORDER BY setting_key ASC';

    const [settings] = await promisePool.query(query);

    // Parse values based on type
    settings.forEach(setting => {
      if (setting.setting_type === 'number') {
        setting.setting_value = parseFloat(setting.setting_value);
      } else if (setting.setting_type === 'boolean') {
        setting.setting_value = setting.setting_value === 'true' || setting.setting_value === '1';
      } else if (setting.setting_type === 'json') {
        try {
          setting.setting_value = JSON.parse(setting.setting_value);
        } catch (e) {
          // Keep as string if JSON parse fails
        }
      }
    });

    return settings;
  }

  // Get settings as key-value object
  static async getAllAsObject(publicOnly = false) {
    const settings = await this.getAll(publicOnly);
    const obj = {};

    settings.forEach(setting => {
      obj[setting.setting_key] = setting.setting_value;
    });

    return obj;
  }

  // Update setting value
  static async update(key, value) {
    const query = 'UPDATE settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?';
    await promisePool.query(query, [value, key]);
    return this.get(key);
  }

  // Delete setting
  static async delete(key) {
    const query = 'DELETE FROM settings WHERE setting_key = ?';
    await promisePool.query(query, [key]);
    return true;
  }

  // Bulk set settings
  static async bulkSet(settingsArray) {
    const promises = settingsArray.map(setting =>
      this.set(setting.key, setting.value, setting.type, setting.description, setting.isPublic)
    );

    await Promise.all(promises);
    return true;
  }
}

module.exports = Settings;