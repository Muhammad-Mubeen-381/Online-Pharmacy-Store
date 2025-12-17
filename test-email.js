// Simple email test script
require('dotenv').config();
const { sendWelcomeEmail } = require('./utils/emailService');

console.log('🧪 Testing Email Configuration...\n');

// Test with a sample email (replace with your email for testing)
const testEmail = 'pharmacare381@gmail.com'; // Change this to test recipient
const testName = 'Test User';

console.log('📧 Sender: pharmacare381@gmail.com');
console.log('📧 Recipient:', testEmail);
console.log('📧 Test: Welcome email\n');

sendWelcomeEmail(testEmail, testName)
    .then(result => {
        if (result.success) {
            console.log('\n✅ SUCCESS! Email sent successfully!');
            console.log('   Check the recipient inbox (and spam folder)');
        } else {
            console.log('\n❌ FAILED! Email not sent.');
            console.log('   Error:', result.message || result.error);
        }
        process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
        console.error('\n❌ ERROR:', error.message);
        process.exit(1);
    });

