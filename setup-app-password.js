// Script to set up App Password in .env file
const fs = require('fs');
const path = require('path');

const appPassword = 'medpnudkxqukbgfq'; // App Password: medp nudk xquk bgfq (spaces removed)

console.log('\n🔧 Setting up Gmail App Password...\n');

const envPath = path.join(__dirname, '.env');

// Check if .env exists and read it
let envContent = '';
if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Found existing .env file');
} else {
    console.log('📝 Creating new .env file');
}

// Update or add email configuration
const emailConfig = `# Email Configuration
EMAIL_USER=pharmacare381@gmail.com
EMAIL_PASSWORD=${appPassword}

# Gmail App Password: medp nudk xquk bgfq (spaces removed)
`;

// Check if EMAIL_USER or EMAIL_PASSWORD already exists
if (envContent.includes('EMAIL_USER=') || envContent.includes('EMAIL_PASSWORD=')) {
    // Update existing values
    let lines = envContent.split('\n');
    let updated = false;
    
    lines = lines.map(line => {
        if (line.startsWith('EMAIL_USER=')) {
            updated = true;
            return `EMAIL_USER=pharmacare381@gmail.com`;
        }
        if (line.startsWith('EMAIL_PASSWORD=')) {
            updated = true;
            return `EMAIL_PASSWORD=${appPassword}`;
        }
        return line;
    });
    
    if (updated) {
        envContent = lines.join('\n');
        console.log('✅ Updated email configuration in .env');
    } else {
        envContent += '\n' + emailConfig;
        console.log('✅ Added email configuration to .env');
    }
} else {
    // Add new configuration
    envContent += (envContent ? '\n' : '') + emailConfig;
    console.log('✅ Added email configuration to .env');
}

// Write the file
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('\n📋 Configuration:');
console.log('   EMAIL_USER: pharmacare381@gmail.com');
console.log('   EMAIL_PASSWORD: ' + appPassword.substring(0, 4) + '**** (hidden)');
console.log('\n✅ .env file configured successfully!');
console.log('\n📝 Next steps:');
console.log('   1. Restart your server');
console.log('   2. Test with: node test-email.js');
console.log('');

