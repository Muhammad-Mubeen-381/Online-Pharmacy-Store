// URGENT: Create .env file with database password
const fs = require('fs');
const path = require('path');

console.log('\n🚨 URGENT: Creating .env file to fix database connection...\n');

const envPath = path.join(__dirname, '.env');

const envContent = `DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Mubeen@381
DB_NAME=pharmacy_store
DB_PORT=3306

JWT_SECRET=pharmacy_store_jwt_secret_key_2025

PORT=3000

EMAIL_USER=pharmacare381@gmail.com
EMAIL_PASSWORD=medpnudkxqukbgfq
`;

try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ SUCCESS! .env file created!');
    console.log('📋 Database password: Mubeen@381');
    console.log('📋 Email configured: pharmacare381@gmail.com');
    console.log('\n🔄 NOW RESTART YOUR SERVER:');
    console.log('   1. Stop server (Ctrl+C)');
    console.log('   2. Run: npm start');
    console.log('\n✅ Database connection should work now!\n');
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n📝 MANUAL FIX REQUIRED:');
    console.error('   1. Go to backend folder');
    console.error('   2. Create file: .env');
    console.error('   3. Copy this content:');
    console.error('\n' + envContent);
}

