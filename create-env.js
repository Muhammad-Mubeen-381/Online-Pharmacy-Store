// Helper script to create .env file with email configuration
const fs = require('fs');
const path = require('path');

console.log('\n📝 Creating .env file for email configuration...\n');

const envPath = path.join(__dirname, '.env');
const envContent = `# Email Configuration
EMAIL_USER=pharmacare381@gmail.com
EMAIL_PASSWORD=Pharmacy381#

# Note: If you get authentication errors, you may need to use Gmail App Password
# Regular password (Pharmacy381#) may not work if 2-Step Verification is enabled
# Get App Password from: https://myaccount.google.com/apppasswords
# 
# Steps if authentication fails:
# 1. Enable 2-Step Verification
# 2. Go to App Passwords
# 3. Generate new password for "Mail" → "Other" → "PharmaStore"
# 4. Copy the 16-character password (remove spaces)
# 5. Replace Pharmacy381# above with the App Password
`;

// Check if .env already exists
if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log('   Reading current content...\n');
    
    const currentContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if EMAIL_PASSWORD is set
    if (currentContent.includes('EMAIL_PASSWORD=')) {
        const emailPasswordLine = currentContent.split('\n').find(line => line.startsWith('EMAIL_PASSWORD='));
        if (emailPasswordLine && !emailPasswordLine.includes('YOUR_APP_PASSWORD_HERE') && emailPasswordLine.split('=')[1].trim()) {
            console.log('✅ EMAIL_PASSWORD is already configured in .env');
            console.log('   Current value:', emailPasswordLine.split('=')[1].substring(0, 4) + '****');
        } else {
            console.log('⚠️  EMAIL_PASSWORD is set but may need to be updated');
            console.log('   Make sure it\'s your Gmail App Password (16 characters, no spaces)');
        }
    } else {
        console.log('❌ EMAIL_PASSWORD not found in .env');
        console.log('   Adding email configuration...\n');
        
        // Append email config to existing .env
        const updatedContent = currentContent + '\n' + envContent;
        fs.writeFileSync(envPath, updatedContent);
        console.log('✅ Added email configuration to .env');
    }
} else {
    console.log('📝 Creating new .env file...\n');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created!');
}

console.log('\n📋 Next Steps:');
console.log('1. Get your Gmail App Password from: https://myaccount.google.com/apppasswords');
console.log('2. Open backend/.env file');
console.log('3. Replace YOUR_APP_PASSWORD_HERE with your 16-character App Password');
console.log('4. Save the file');
console.log('5. Restart your server');
console.log('6. Test with: node test-email.js\n');

console.log('📖 For detailed instructions, see: GMAIL_APP_PASSWORD_GUIDE.md\n');

