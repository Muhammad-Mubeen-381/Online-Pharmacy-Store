// Quick script to check email configuration
require('dotenv').config();

console.log('\n📧 Email Configuration Check\n');
console.log('='.repeat(50));

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;

if (emailUser) {
    console.log('✅ EMAIL_USER is set:', emailUser);
} else {
    console.log('❌ EMAIL_USER is NOT set');
    console.log('   Add this to your .env file:');
    console.log('   EMAIL_USER=muhammadmubeenasghar381@gmail.com');
}

if (emailPassword) {
    console.log('✅ EMAIL_PASSWORD is set:', '*'.repeat(emailPassword.length));
    if (emailPassword.includes(' ')) {
        console.log('⚠️  WARNING: Password contains spaces. Remove them!');
    }
    if (emailPassword.length !== 16) {
        console.log('⚠️  WARNING: App password should be 16 characters');
    }
} else {
    console.log('❌ EMAIL_PASSWORD is NOT set');
    console.log('   Add this to your .env file:');
    console.log('   EMAIL_PASSWORD=your_gmail_app_password_here');
    console.log('\n   To get an App Password:');
    console.log('   1. Go to: https://myaccount.google.com/');
    console.log('   2. Security > App passwords');
    console.log('   3. Generate a new app password');
    console.log('   4. Copy the 16-character password (remove spaces)');
}

console.log('\n' + '='.repeat(50));

if (emailUser && emailPassword) {
    console.log('✅ Email configuration looks good!');
    console.log('   Make sure you restarted your server after creating .env');
} else {
    console.log('❌ Email configuration is incomplete!');
    console.log('   See SETUP_EMAIL.md for detailed instructions');
}

console.log('');

