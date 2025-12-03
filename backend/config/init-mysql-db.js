const fs = require('fs');
const path = require('path');
const { promisePool } = require('./mysql-connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const initializeDatabase = async () => {
    console.log('🚀 Starting MySQL Database Initialization...\n');

    try {
        // Read SQL schema file
        const schemaPath = path.join(__dirname, 'database-schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📋 Found ${statements.length} SQL statements to execute\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            // Skip comments
            if (statement.startsWith('--')) continue;

            try {
                await promisePool.query(statement);

                // Log progress
                if (statement.toLowerCase().includes('create database')) {
                    console.log('✅ Database created/verified');
                } else if (statement.toLowerCase().includes('create table')) {
                    const tableName = statement.match(/create table (?:if not exists )?`?(\w+)`?/i);
                    if (tableName) {
                        console.log(`✅ Table created: ${tableName[1]}`);
                    }
                } else if (statement.toLowerCase().includes('insert into users')) {
                    console.log('✅ Default admin user created');
                } else if (statement.toLowerCase().includes('insert into settings')) {
                    console.log('✅ Default settings inserted');
                }
            } catch (error) {
                // Ignore "database exists" and "table exists" errors
                if (!error.message.includes('exists')) {
                    console.error(`❌ Error executing statement:`, error.message);
                }
            }
        }

        console.log('\n🎉 Database initialization completed successfully!\n');
        console.log('📝 Default Admin Credentials:');
        console.log('   Email: admin@sarboshakti.org');
        console.log('   Password: admin123\n');
        console.log('⚠️  Please change the admin password after first login!\n');

        // Verify admin user
        const [users] = await promisePool.query('SELECT id, name, email, role FROM users WHERE email = ?', ['admin@sarboshakti.org']);
        if (users.length > 0) {
            console.log('✅ Admin user verified in database');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

// Run initialization
initializeDatabase();
