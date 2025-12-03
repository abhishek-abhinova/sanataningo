const User = require('./models/User');

(async () => {
  try {
    console.log('🔄 Creating admin user...');

    // Delete existing admin if exists
    const { promisePool } = require('./config/mysql-connection');
    await promisePool.query('DELETE FROM users WHERE email = ?', ['admin@sarboshakti.org']);

    // Create new admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@sarboshakti.org',
      password: 'admin123',
      role: 'superadmin',
      is_active: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('\n📝 Login credentials:');
    console.log('Email: admin@sarboshakti.org');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();