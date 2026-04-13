
const nodemailer = require("nodemailer");
 
// SMTP service configuration
const getSmtpConfig = () => {
  const service = process.env.SMTP_SERVICE?.toLowerCase();
 
  // Agar env mein EMAIL_HOST diya hai toh直接用
  if (process.env.EMAIL_HOST) {
    return {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true' || false,
    };
  }
 
  // Service-based configuration
  if (service) {
    switch (service) {
      case 'gmail':
        return {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
        };
      case 'outlook':
      case 'hotmail':
        return {
          host: 'smtp-mail.outlook.com',
          port: 587,
          secure: false,
        };
      case 'brevo':
      case 'sendinblue':
        return {
          host: 'smtp-relay.brevo.com',
          port: 587,
          secure: false,
        };
      case 'yahoo':
        return {
          host: 'smtp.mail.yahoo.com',
          port: 587,
          secure: false,
        };
      default:
        return {
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: process.env.EMAIL_SECURE === 'true' || false,
        };
    }
  }
 
  // Default fallback
  return {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
  };
};
 
// Enhanced HTML email template with better UI
const getResetPasswordEmailTemplate = (resetUrl, userEmail = '') => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - ShopEase</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
 
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
 
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }
 
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
        }
 
        .card {
          background: #ffffff;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.6s ease-out;
        }
 
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
 
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }
 
        .logo {
          font-size: 3.5rem;
          margin-bottom: 15px;
          position: relative;
          z-index: 1;
          animation: float 3s ease-in-out infinite;
        }
 
        .brand-name {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
 
        .brand-name span {
          color: #ffd700;
          display: inline-block;
          animation: sparkle 2s linear infinite;
        }
 
        .content {
          padding: 40px 35px;
          background: #ffffff;
        }
 
        .title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
 
        .subtitle {
          color: #6b7280;
          font-size: 1rem;
          line-height: 1.6;
          text-align: center;
          margin-bottom: 30px;
        }
 
        .user-email {
          background: linear-gradient(135deg, #f0f9ff 0%, #e6f0ff 100%);
          border-radius: 15px;
          padding: 15px 20px;
          margin-bottom: 30px;
          text-align: center;
          border: 2px dashed #667eea;
        }
 
        .user-email-label {
          font-size: 0.85rem;
          color: #4b5563;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
 
        .user-email-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #667eea;
          word-break: break-all;
        }
 
        .button-container {
          text-align: center;
          margin-bottom: 30px;
        }
 
        .reset-button {
          display: inline-block;
          padding: 16px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
          box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.5);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
 
        .reset-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(102, 126, 234, 0.6);
        }
 
        .reset-button:active {
          transform: translateY(0);
        }
 
        .reset-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.5s;
        }
 
        .reset-button:active::after {
          transform: translate(-50%, -50%) scale(1);
        }
 
        .alternative-link {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 15px;
        }
 
        .alternative-link-text {
          color: #4b5563;
          font-size: 0.95rem;
          margin-bottom: 10px;
        }
 
        .link-box {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 12px 15px;
          font-size: 0.85rem;
          color: #667eea;
          word-break: break-all;
          font-family: monospace;
          position: relative;
        }
 
        .copy-button {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 5px 10px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }
 
        .copy-button:hover {
          background: #5a67d8;
        }
 
        .expiry-notice {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px 20px;
          border-radius: 10px;
          margin-bottom: 25px;
        }
 
        .expiry-title {
          color: #92400e;
          font-weight: 600;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
 
        .expiry-text {
          color: #b45309;
          font-size: 0.9rem;
        }
 
        .timer {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f59e0b;
          margin-top: 5px;
        }
 
        .security-tips {
          background: #f0f9ff;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 30px;
        }
 
        .security-title {
          color: #0369a1;
          font-weight: 600;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
 
        .security-list {
          list-style: none;
          padding: 0;
        }
 
        .security-list li {
          color: #4b5563;
          font-size: 0.9rem;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
 
        .security-list li::before {
          content: '✓';
          color: #10b981;
          font-weight: bold;
        }
 
        .footer {
          background: #f9fafb;
          padding: 30px 35px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
 
        .footer-text {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 20px;
        }
 
        .social-links {
          margin-bottom: 20px;
        }
 
        .social-link {
          display: inline-block;
          margin: 0 10px;
          color: #6b7280;
          text-decoration: none;
          font-size: 1.2rem;
          transition: color 0.3s ease;
        }
 
        .social-link:hover {
          color: #667eea;
        }
 
        .footer-links {
          margin-bottom: 15px;
        }
 
        .footer-link {
          color: #667eea;
          text-decoration: none;
          font-size: 0.85rem;
          margin: 0 10px;
          transition: color 0.3s ease;
        }
 
        .footer-link:hover {
          color: #5a67d8;
          text-decoration: underline;
        }
 
        .copyright {
          color: #9ca3af;
          font-size: 0.8rem;
        }
 
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
 
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
 
        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
 
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
 
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
 
        @media (max-width: 600px) {
          .container {
            margin: 20px auto;
            padding: 10px;
          }
 
          .header {
            padding: 30px 20px;
          }
 
          .brand-name {
            font-size: 1.8rem;
          }
 
          .content {
            padding: 30px 20px;
          }
 
          .title {
            font-size: 1.5rem;
          }
 
          .reset-button {
            padding: 14px 30px;
            font-size: 1rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="logo">🔐</div>
            <h1 class="brand-name">ShopEase <span>✨</span></h1>
          </div>
 
          <div class="content">
            <h2 class="title">Reset Your Password</h2>
            <p class="subtitle">
              We received a request to reset the password for your ShopEase account.
            </p>
 
            ${userEmail ? `
            <div class="user-email">
              <div class="user-email-label">Account Email</div>
              <div class="user-email-value">${userEmail}</div>
            </div>
            ` : ''}
 
            <div class="button-container">
              <a href="${resetUrl}" class="reset-button">
                Reset Password
              </a>
            </div>
 
            <div class="expiry-notice">
              <div class="expiry-title">
                ⏰ Link Expires in 10 Minutes
              </div>
              <div class="expiry-text">
                For security reasons, this password reset link will expire in 10 minutes.
                If you didn't request this, please ignore this email.
              </div>
            </div>
 
            <div class="alternative-link">
              <div class="alternative-link-text">
                If the button doesn't work, copy and paste this link:
              </div>
              <div style="position: relative;">
                <div class="link-box" id="resetLink">
                  ${resetUrl}
                </div>
                <button class="copy-button" onclick="copyToClipboard('${resetUrl}')">
                  Copy
                </button>
              </div>
            </div>
 
            <div class="security-tips">
              <div class="security-title">
                🛡️ Security Tips
              </div>
              <ul class="security-list">
                <li>Never share this link with anyone</li>
                <li>Create a strong password with letters, numbers, and symbols</li>
                <li>Don't use the same password for multiple accounts</li>
                <li>Enable two-factor authentication for extra security</li>
              </ul>
            </div>
          </div>
 
          <div class="footer">
            <div class="footer-text">
              This email was sent to ${userEmail || 'you'} because a password reset was requested for your ShopEase account.
            </div>
 
            <div class="social-links">
              <a href="#" class="social-link">📘</a>
              <a href="#" class="social-link">🐦</a>
              <a href="#" class="social-link">📷</a>
              <a href="#" class="social-link">💼</a>
            </div>
 
            <div class="footer-links">
              <a href="#" class="footer-link">About Us</a>
              <a href="#" class="footer-link">Privacy Policy</a>
              <a href="#" class="footer-link">Terms of Service</a>
              <a href="#" class="footer-link">Contact Support</a>
            </div>
 
            <div class="copyright">
              © ${new Date().getFullYear()} ShopEase. All rights reserved.
            </div>
          </div>
        </div>
      </div>
 
      <script>
        function copyToClipboard(text) {
          navigator.clipboard.writeText(text).then(() => {
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.background = '#10b981';
            setTimeout(() => {
              button.textContent = originalText;
              button.style.background = '#667eea';
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy:', err);
          });
        }
      </script>
    </body>
    </html>
  `;
};
 
// Enhanced password reset confirmation email
const getPasswordChangedConfirmationTemplate = (userEmail) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed - ShopEase</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 0;
        }
 
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
        }
 
        .card {
          background: #ffffff;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        }
 
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 40px 30px;
          text-align: center;
        }
 
        .success-icon {
          font-size: 4rem;
          margin-bottom: 15px;
          animation: bounce 1s infinite;
        }
 
        .brand-name {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
 
        .content {
          padding: 40px 35px;
          text-align: center;
        }
 
        .title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 15px;
        }
 
        .message {
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 25px;
        }
 
        .button {
          display: inline-block;
          padding: 14px 35px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          margin: 20px 0;
        }
 
        .footer {
          background: #f9fafb;
          padding: 30px 35px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
 
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1 class="brand-name">ShopEase</h1>
          </div>
 
          <div class="content">
            <h2 class="title">Password Changed Successfully!</h2>
            <p class="message">
              Your ShopEase account password has been updated. 
              You can now log in with your new password.
            </p>
 
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
              Go to Login
            </a>
 
            <p style="color: #6b7280; font-size: 0.9rem; margin-top: 20px;">
              If you didn't make this change, please contact support immediately.
            </p>
          </div>
 
          <div class="footer">
            <div style="color: #6b7280; font-size: 0.9rem;">
              This email was sent to ${userEmail}
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
 
const sendResetPasswordEmail = async (email, resetUrl) => {
  try {
    // Get SMTP config
    const smtpConfig = getSmtpConfig();
 
    console.log("📧 SMTP Config:", {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: process.env.EMAIL_USER,
      service: process.env.SMTP_SERVICE
    });
 
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      debug: true,
      logger: true,
      tls: {
        rejectUnauthorized: false // For development only
      }
    });
 
    // Verify connection
    console.log("🔄 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified!");
 
    // Get HTML template
    const htmlTemplate = getResetPasswordEmailTemplate(resetUrl, email);
 
    // Email content
    const message = {
      from: `"ShopEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Reset Your ShopEase Password",
      html: htmlTemplate,
      text: `
        Reset Your ShopEase Password
 
        Click the link below to reset your password:
        ${resetUrl}
 
        This link will expire in 10 minutes.
 
        If you didn't request this, please ignore this email.
 
        © ${new Date().getFullYear()} ShopEase. All rights reserved.
      `,
    };
 
    // Send email
    console.log(`📧 Sending email to: ${email}`);
    const info = await transporter.sendMail(message);
 
    console.log(`✅ Email sent! Message ID: ${info.messageId}`);
    return { 
      success: true, 
      messageId: info.messageId,
      message: "Password reset email sent successfully"
    };
 
  } catch (error) {
    console.error("❌ Email sending error:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
 
    // Better error messages
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`Connection refused to ${error.address}:${error.port}. Please check your EMAIL_HOST in .env file.`);
    } else if (error.code === 'EAUTH') {
      throw new Error('Authentication failed. Please verify your EMAIL_USER and EMAIL_PASS credentials.');
    } else if (error.code === 'ESOCKET') {
      throw new Error(`Socket error: ${error.message}. Please check your network connection.`);
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Connection timed out. Please try again later.');
    }
 
    throw error;
  }
};
 
// Send password changed confirmation
const sendPasswordChangedEmail = async (email) => {
  try {
    const smtpConfig = getSmtpConfig();
 
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
 
    const htmlTemplate = getPasswordChangedConfirmationTemplate(email);
 
    const message = {
      from: `"ShopEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Password Changed Successfully - ShopEase",
      html: htmlTemplate,
      text: `
        Your ShopEase password has been changed successfully.
 
        If you didn't make this change, please contact support immediately.
 
        © ${new Date().getFullYear()} ShopEase. All rights reserved.
      `,
    };
 
    const info = await transporter.sendMail(message);
    return { success: true, messageId: info.messageId };
 
  } catch (error) {
    console.error("❌ Confirmation email error:", error);
    throw error;
  }
};
 
// Test function
const testEmailConnection = async () => {
  try {
    console.log("🔄 Testing email configuration...");
 
    const smtpConfig = getSmtpConfig();
 
    console.log("📋 Configuration:", {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      user: process.env.EMAIL_USER ? '✓ Provided' : '✗ Missing',
      pass: process.env.EMAIL_PASS ? '✓ Provided' : '✗ Missing',
      service: process.env.SMTP_SERVICE || 'Not specified'
    });
 
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('EMAIL_USER and EMAIL_PASS must be configured in .env file');
    }
 
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true
    });
 
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    console.log(`📧 Using service: ${process.env.SMTP_SERVICE || 'Custom SMTP'}`);
 
    return {
      success: true,
      message: 'Email configuration is working correctly',
      config: {
        host: smtpConfig.host,
        port: smtpConfig.port,
        user: process.env.EMAIL_USER
      }
    };
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
 
    let suggestion = '';
    if (error.message.includes('EAUTH')) {
      suggestion = 'Please check your email password. For Gmail, you might need an App Password instead of your regular password.';
    } else if (error.message.includes('ECONNREFUSED')) {
      suggestion = 'Please verify the SMTP host and port in your .env file.';
    }
 
    return {
      success: false,
      message: error.message,
      suggestion
    };
  }
};
 
// Welcome email template
const getWelcomeEmailTemplate = (username) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ShopEase COLLECTIVE</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }
        
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
        }
        
        .card {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }
        
        .header {
          background: linear-gradient(135deg, #c9a962 0%, #d4b978 50%, #c9a962 100%);
          padding: 50px 30px;
          text-align: center;
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></svg>');
          background-size: 100px;
          opacity: 0.3;
        }
        
        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a2e;
          letter-spacing: 8px;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        
        .tagline {
          font-size: 0.95rem;
          color: rgba(26, 26, 46, 0.7);
          letter-spacing: 3px;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }
        
        .celebration {
          font-size: 4rem;
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }
        
        .content {
          padding: 50px 40px;
          background: #ffffff;
        }
        
        .welcome-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 10px;
          text-align: center;
        }
        
        .username {
          color: #c9a962;
          font-weight: 700;
        }
        
        .message {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.8;
          text-align: center;
          margin: 25px 0 35px;
        }
        
        .features {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 35px;
        }
        
        .feature {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          border-left: 4px solid #c9a962;
        }
        
        .feature-icon {
          font-size: 1.5rem;
        }
        
        .feature-text {
          color: #475569;
          font-size: 0.95rem;
        }
        
        .feature-text strong {
          color: #1a1a2e;
        }
        
        .cta-container {
          text-align: center;
          margin: 35px 0;
        }
        
        .cta-button {
          display: inline-block;
          padding: 16px 45px;
          background: linear-gradient(135deg, #c9a962 0%, #d4b978 100%);
          color: #1a1a2e !important;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 1px;
          box-shadow: 0 10px 25px -5px rgba(201, 169, 98, 0.4);
          transition: all 0.3s ease;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(201, 169, 98, 0.5);
        }
        
        .footer {
          background: #f8fafc;
          padding: 35px 40px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        
        .social-links {
          margin-bottom: 20px;
        }
        
        .social-link {
          display: inline-block;
          margin: 0 12px;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #c9a962 0%, #d4b978 100%);
          border-radius: 50%;
          line-height: 40px;
          text-align: center;
          color: #1a1a2e;
          text-decoration: none;
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }
        
        .social-link:hover {
          transform: translateY(-3px);
        }
        
        .copyright {
          color: #94a3b8;
          font-size: 0.8rem;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @media (max-width: 600px) {
          .container { margin: 20px auto; padding: 10px; }
          .header { padding: 40px 20px; }
          .content { padding: 35px 25px; }
          .footer { padding: 25px 20px; }
          .logo { font-size: 2rem; letter-spacing: 5px; }
          .welcome-title { font-size: 1.6rem; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="logo">ShopEase</div>
            <div class="tagline">Collective</div>
          </div>
          
          <div class="content">
            <div class="celebration">🎉</div>
            <h1 class="welcome-title">Welcome to ShopEase COLLECTIVE!</h1>
            <p class="message">
              Dear <span class="username">${username}</span>,<br><br>
              Thank you for joining our exclusive community. We're thrilled to have you as part of the ShopEase COLLECTIVE family!
            </p>
            
            <div class="features">
              <div class="feature">
                <span class="feature-icon">🛍️</span>
                <span class="feature-text"><strong>Exclusive Collection</strong> - Access to premium luxury products</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🎁</span>
                <span class="feature-text"><strong>Special Offers</strong> - Early access to sales and promotions</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🚚</span>
                <span class="feature-text"><strong>Free Shipping</strong> - On orders above ₹999</span>
              </div>
              <div class="feature">
                <span class="feature-icon">💎</span>
                <span class="feature-text"><strong>Premium Quality</strong> - Curated luxury items just for you</span>
              </div>
            </div>
            
            <div class="cta-container">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="cta-button">
                Start Shopping
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              Thank you for choosing ShopEase COLLECTIVE.<br>
              Experience luxury like never before.
            </p>
            
            <div class="social-links">
              <a href="#" class="social-link">📘</a>
              <a href="#" class="social-link">🐦</a>
              <a href="#" class="social-link">📷</a>
            </div>
            
            <p class="copyright">
              © ${new Date().getFullYear()} ShopEase COLLECTIVE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send welcome email
const sendWelcomeEmail = async (email, username) => {
  try {
    console.log("🔄 Starting welcome email process...");
    console.log("📧 Email:", email, "Username:", username);
    
    const smtpConfig = getSmtpConfig();
    console.log("📋 SMTP Config:", smtpConfig);

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? "***" : "MISSING",
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log("🔄 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified!");

    const htmlTemplate = getWelcomeEmailTemplate(username);

    const message = {
      from: `"ShopEase COLLECTIVE" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to ShopEase COLLECTIVE - Thank You for Joining!",
      html: htmlTemplate,
      text: `
        Welcome to ShopEase COLLECTIVE, ${username}!
        
        Thank you for joining our exclusive community. We're thrilled to have you!
        
        What awaits you:
        - Exclusive luxury products
        - Special offers and early access to sales
        - Premium quality curated items
        
        Start shopping now: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
        
        © ${new Date().getFullYear()} ShopEase COLLECTIVE. All rights reserved.
      `,
    };

    console.log("📤 Sending welcome email...");
    const info = await transporter.sendMail(message);
    console.log("✅ Welcome email sent! Message ID:", info.messageId);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ Welcome email error:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    return { success: false, message: error.message, code: error.code };
  }
};

module.exports = { 
  sendResetPasswordEmail, 
  sendPasswordChangedEmail,
  sendWelcomeEmail,
  testEmailConnection 
};
 
