require('dotenv').config();
const { testEmailConfiguration } = require('./utils/emailService');

async function testEmail() {
  console.log('Testing email configuration...');
  const result = await testEmailConfiguration();
  if (result.success) {
    console.log('✅ Email configuration is working!');
  } else {
    console.log('❌ Email configuration failed:', result.error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Ensure EMAIL_USER and EMAIL_PASS are set in .env');
    console.log('2. For Gmail, use an App Password instead of your regular password');
    console.log('3. Enable 2-Factor Authentication on your Gmail account');
    console.log('4. Generate an App Password: https://support.google.com/accounts/answer/185833');
    console.log('5. Check your network/firewall settings');
  }
}

testEmail().catch(console.error);
