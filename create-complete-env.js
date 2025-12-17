// Complete .env file setup with all required configuration
const fs = require('fs');
const path = require('path');

console.log('\n🔧 Creating complete .env file with all configuration...\n');

const envPath = path.join(__dirname, '.env');

const envContent = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Mubeen@381
DB_NAME=pharmacy_store
DB_PORT=3306

# JWT Secret (for authentication tokens)
JWT_SECRET=pharmacy_store_jwt_secret_key_2025

# Server Port
PORT=3000

# Email Configuration
EMAIL_USER=pharmacare381@gmail.com
EMAIL_PASSWORD=medpnudkxqukbgfq

# Gmail App Password: medp nudk xquk bgfq (spaces removed)
`;

try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ .env file created successfully!\n');
    console.log('📋 Configuration added:');
    console.log('   ✅ Database: localhost/pharmacy_store');
    console.log('   ✅ DB User: root');
    console.log('   ✅ DB Password: Mubeen@381');
    console.log('   ✅ Email: pharmacare381@gmail.com');
    console.log('   ✅ Email App Password: medpnudkxqukbgfq');
    console.log('   ✅ JWT Secret: configured');
    console.log('   ✅ Port: 3000\n');
    console.log('🚀 Next step: Restart your server!\n');
    console.log('   Stop server (Ctrl+C) and run: npm start\n');
} catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    console.error('\n📝 Please create .env file manually in backend folder with:');
    console.log(envContent);
}

