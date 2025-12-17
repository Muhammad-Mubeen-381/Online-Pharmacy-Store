const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail
const createTransporter = () => {
    const emailUser = process.env.EMAIL_USER || 'pharmacare381@gmail.com';
    const emailPassword = process.env.EMAIL_PASSWORD || 'Pharmacy381#';
    
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPassword
        }
    });
};

// Email templates
const emailTemplates = {
    welcome: (userName) => {
        return {
            subject: 'Welcome to PharmaStore - Account Created Successfully!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>💊 Welcome to PharmaStore!</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${userName},</h2>
                            <p>Thank you for signing up with PharmaStore! Your account has been created successfully.</p>
                            <p>We're excited to have you as part of our community. You can now:</p>
                            <ul>
                                <li>Browse our wide range of medicines</li>
                                <li>Place orders for delivery</li>
                                <li>Track your orders</li>
                                <li>Manage your profile and addresses</li>
                            </ul>
                            <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                            <p>Best regards,<br><strong>The PharmaStore Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2025 PharmaStore. All Rights Reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
    },

    orderConfirmation: (userName, orderId, orderTotal, orderItems) => {
        const itemsList = orderItems.map(item => 
            `<tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.medicine_name || 'Medicine'}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">PKR ${item.price}</td>
            </tr>`
        ).join('');

        return {
            subject: `Order Confirmation - Order #${orderId}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .order-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
                        .order-items { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        .order-items th { background: #667eea; color: white; padding: 10px; text-align: left; }
                        .order-items td { padding: 10px; border-bottom: 1px solid #ddd; }
                        .total { text-align: right; font-size: 18px; font-weight: bold; color: #667eea; margin-top: 20px; }
                        .delivery-notice { background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4caf50; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Order Confirmed!</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${userName},</h2>
                            <p>Thank you for your order! We've received your order and it's being processed.</p>
                            
                            <div class="order-info">
                                <h3>Order Details</h3>
                                <p><strong>Order ID:</strong> #${orderId}</p>
                                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>

                            <h3>Order Items:</h3>
                            <table class="order-items">
                                <thead>
                                    <tr>
                                        <th>Medicine</th>
                                        <th style="text-align: center;">Quantity</th>
                                        <th style="text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsList}
                                </tbody>
                            </table>

                            <div class="total">
                                <p>Total Amount: PKR ${orderTotal}</p>
                            </div>

                            <div class="delivery-notice">
                                <h3 style="margin-top: 0; color: #2e7d32;">🚚 Delivery Information</h3>
                                <p><strong>Your order will be delivered within 24 hours!</strong></p>
                                <p>Our delivery team will contact you shortly to confirm the delivery time and address.</p>
                                <p>Please ensure someone is available to receive the order.</p>
                            </div>

                            <p>You can track your order status in your dashboard. If you have any questions, please contact our support team.</p>
                            
                            <p>Best regards,<br><strong>The PharmaStore Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2025 PharmaStore. All Rights Reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
    }
};

// Send email function
const sendEmail = async (to, subject, html) => {
    try {
        console.log('📧 Attempting to send email to:', to);
        console.log('📧 Email subject:', subject);
        
        const emailUser = process.env.EMAIL_USER || 'pharmacare381@gmail.com';
        const emailPassword = process.env.EMAIL_PASSWORD || 'Pharmacy381#';
        
        console.log('📧 Using email:', emailUser);
        console.log('📧 Password configured:', emailPassword ? 'Yes' : 'No');
        
        const transporter = createTransporter();
        
        // Verify connection first (this will test authentication)
        try {
            await transporter.verify();
            console.log('✅ SMTP connection verified - Authentication successful!');
        } catch (verifyError) {
            console.error('❌ SMTP verification failed:', verifyError.message);
            throw verifyError; // Re-throw to be caught by outer catch
        }
        
        const mailOptions = {
            from: `"PharmaStore" <${emailUser}>`,
            to: to,
            subject: subject,
            html: html
        };

        console.log('📧 Sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log('   Message ID:', info.messageId);
        console.log('   Response:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.error('❌ Error code:', error.code);
        
        // Provide specific guidance based on error
        if (error.code === 'EAUTH' || error.message.includes('Invalid login') || error.message.includes('authentication')) {
            console.error('\n❌ AUTHENTICATION FAILED - Gmail Security Issue');
            console.error('═══════════════════════════════════════════════════');
            console.error('Gmail requires App Password, not regular password!');
            console.error('\n📋 SOLUTION:');
            console.error('1. Go to: https://myaccount.google.com/');
            console.error('2. Click "Security" → Enable "2-Step Verification"');
            console.error('3. Go to "App passwords" → Generate new password');
            console.error('4. Select: Mail → Other → Name: "PharmaStore"');
            console.error('5. Copy the 16-character password (remove spaces)');
            console.error('6. Add to .env file: EMAIL_PASSWORD=your_app_password');
            console.error('\n⚠️  Regular password (Mubeen@381) will NOT work with Gmail SMTP');
            console.error('═══════════════════════════════════════════════════\n');
        } else if (error.code === 'ECONNECTION' || error.message.includes('connection')) {
            console.error('❌ Connection error - Check your internet connection');
        } else {
            console.error('❌ Full error details:', error);
        }
        
        return { success: false, error: error.message, code: error.code };
    }
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
    const template = emailTemplates.welcome(userName);
    return await sendEmail(userEmail, template.subject, template.html);
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, userName, orderId, orderTotal, orderItems) => {
    const template = emailTemplates.orderConfirmation(userName, orderId, orderTotal, orderItems);
    return await sendEmail(userEmail, template.subject, template.html);
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendOrderConfirmationEmail
};

