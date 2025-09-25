import nodemailer from 'nodemailer'

// Create reusable transporter object using the default SMTP transport
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  return nodemailer.createTransport(config);
};

// Function to send email with retry logic and error handling
export const sendEmail = async (to, subject, html, text, retries = 3) => {
  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Validate environment variables
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email configuration not found. Please set EMAIL_USER and EMAIL_PASS in environment variables.');
      }

      const transporter = createTransporter();

      // Verify SMTP connection configuration
      await transporter.verify();
      console.log('Email server is ready to send messages');

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"TravelGrid" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
        text: text || html.replace(/<[^>]*>?/gm, ''), // Strip HTML tags for text version
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', {
        messageId: info.messageId,
        to: to,
        subject: subject
      });

      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };

    } catch (error) {
      console.error(`Email sending error (attempt ${attempt}/${retries}):`, {
        error: error.message,
        code: error.code,
        to: to,
        subject: subject
      });

      lastError = error;

      // If it's the last attempt, don't retry
      if (attempt === retries) {
        break;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Max 5 seconds
      console.log(`Retrying email send in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Handle specific error cases
  if (lastError && lastError.code === 'EAUTH') {
    throw new Error('Email authentication failed. Please check your email credentials.');
  } else if (lastError && lastError.code === 'ECONNECTION') {
    throw new Error('Failed to connect to email server. Please check your network connection.');
  } else if (lastError) {
    throw new Error(`Email sending failed after ${retries} attempts: ${lastError.message}`);
  }
};

// Send verification email template
export const sendVerificationEmail = async (to, name, verificationCode) => {
  const subject = 'Verify Your Email - TravelGrid';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - TravelGrid</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          background-color: #f7f7f7; 
          margin: 0; 
          padding: 20px; 
          line-height: 1.6;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: white; 
          border-radius: 10px; 
          overflow: hidden; 
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
        }
        .header { 
          background: linear-gradient(135deg, #ec4899, #f97316); 
          color: white; 
          padding: 30px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header h2 {
          margin: 10px 0 0 0;
          font-size: 18px;
          font-weight: normal;
          opacity: 0.9;
        }
        .content { 
          padding: 30px; 
          color: #333;
        }
        .code { 
          font-size: 32px; 
          font-weight: bold; 
          color: #ec4899; 
          text-align: center; 
          letter-spacing: 5px; 
          margin: 20px 0; 
          padding: 15px; 
          border: 2px dashed #ec4899; 
          border-radius: 10px; 
          background-color: #fdf2f8; 
        }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #ec4899, #f97316); 
          color: white; 
          padding: 12px 30px; 
          text-decoration: none; 
          border-radius: 25px; 
          font-weight: bold; 
          margin: 20px 0; 
        }
        .footer { 
          background-color: #f9f9f9; 
          padding: 20px; 
          text-align: center; 
          color: #666; 
          font-size: 14px; 
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 5px;
          }
          .header {
            padding: 20px;
          }
          .content {
            padding: 20px;
          }
          .code {
            font-size: 24px;
            letter-spacing: 3px;
            padding: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌍 TravelGrid</h1>
          <h2>Verify Your Email Address</h2>
        </div>
        <div class="content">
          <h3>Hello ${name}!</h3>
          <p>Welcome to TravelGrid! To complete your registration and start exploring amazing destinations, please verify your email address.</p>
          <p><strong>Your verification code is:</strong></p>
          <div class="code">${verificationCode}</div>
          <div class="warning">
            <strong>⏰ Important:</strong> This code will expire in <strong>5 minutes</strong>.
          </div>
          <p>Enter this code on the verification page to activate your account and start planning your next adventure!</p>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(to)}" class="button">
              Verify Email Now
            </a>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            If you didn't create an account with TravelGrid, you can safely ignore this email.
          </p>
        </div>
        <div class="footer">
          <p><strong>TravelGrid Team</strong></p>
          <p>© 2025 TravelGrid. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(to, subject, html);
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('❌ Email configuration test failed:', error.message);
    return { success: false, error: error.message };
  }
};