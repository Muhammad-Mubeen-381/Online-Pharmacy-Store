/**
 * Seed script to create default admin and user accounts
 * Run this script using: node backend/database/seed-users.js
 * 
 * Default credentials:
 * - Admin: admin@pharmastore.pk / admin123
 * - User: user@pharmastore.pk / user123
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedUsers() {
    let connection;
    
    try {
        // Create database connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'pharmacy_store',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Connected to database');

        // Hash passwords
        const adminPassword = 'admin123';
        const userPassword = 'user123';
        const saltRounds = 10;

        const adminPasswordHash = await bcrypt.hash(adminPassword, saltRounds);
        const userPasswordHash = await bcrypt.hash(userPassword, saltRounds);

        console.log('✅ Passwords hashed');

        // Check if admin already exists
        const [existingAdmins] = await connection.execute(
            'SELECT id FROM admins WHERE email = ?',
            ['admin@pharmastore.pk']
        );

        if (existingAdmins.length > 0) {
            // Update existing admin password
            await connection.execute(
                'UPDATE admins SET password = ?, name = ?, phone = ?, role = ? WHERE email = ?',
                [adminPasswordHash, 'Admin User', '+92 300 1234567', 'admin', 'admin@pharmastore.pk']
            );
            console.log('✅ Admin account password updated');
        } else {
            // Create new admin
            await connection.execute(
                'INSERT INTO admins (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
                ['Admin User', 'admin@pharmastore.pk', adminPasswordHash, '+92 300 1234567', 'admin']
            );
            console.log('✅ Admin account created');
        }

        // Check if user already exists
        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            ['user@pharmastore.pk']
        );

        if (existingUsers.length > 0) {
            // Update existing user password
            await connection.execute(
                'UPDATE users SET password = ?, name = ?, phone = ? WHERE email = ?',
                [userPasswordHash, 'Test User', '+92 300 1234568', 'user@pharmastore.pk']
            );
            console.log('✅ User account password updated');
        } else {
            // Create new user
            await connection.execute(
                'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
                ['Test User', 'user@pharmastore.pk', userPasswordHash, '+92 300 1234568']
            );
            console.log('✅ User account created');
        }

        console.log('\n🎉 Seed completed successfully!');
        console.log('\n📋 Default Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Admin Account:');
        console.log('  Email: admin@pharmastore.pk');
        console.log('  Password: admin123');
        console.log('\nUser Account:');
        console.log('  Email: user@pharmastore.pk');
        console.log('  Password: user123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error seeding users:', error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   → Check your database credentials in .env file');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('   → Database does not exist. Please run schema.sql first');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('   → Cannot connect to MySQL. Make sure MySQL server is running');
        }
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('✅ Database connection closed');
        }
    }
}

// Run the seed script
seedUsers();

