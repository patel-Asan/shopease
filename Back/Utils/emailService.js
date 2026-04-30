const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "asan798494@gmail.com";
const FROM_NAME = "ShopEase";

const sendEmail = async ({ to, subject, html, text }) => {
  console.log(`📧 Sending via Brevo to: ${to} | Subject: ${subject}`);
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: FROM_EMAIL, name: FROM_NAME },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text || undefined,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Brevo API error:", data);
    throw new Error(data.message || `Brevo API error ${res.status}`);
  }

  console.log(`✅ Email sent! Message ID: ${data.messageId}`);
  return { success: true, messageId: data.messageId };
};

const sendResetPasswordEmail = async (email, resetUrl) => {
  const html = getResetPasswordEmailTemplate(resetUrl, email);
  return sendEmail({
    to: email,
    subject: "Reset Your ShopEase Password",
    html,
    text: `Click to reset: ${resetUrl}\nLink expires in 10 minutes.`,
  });
};

const sendPasswordChangedEmail = async (email) => {
  const html = getPasswordChangedConfirmationTemplate(email);
  return sendEmail({
    to: email,
    subject: "Password Changed Successfully - ShopEase",
    html,
    text: "Your ShopEase password has been updated.",
  });
};

const sendWelcomeEmail = async (email, username) => {
  if (!BREVO_API_KEY) {
    console.log("⚠️ Brevo API key not configured");
    return { success: false, message: "Email not configured" };
  }
  return sendEmail({
    to: email,
    subject: "Welcome to ShopEase!",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:30px;">
        <h1 style="color:#667eea;">Welcome to ShopEase, ${username}!</h1>
        <p>Thank you for joining our community. Start shopping now!</p>
        <a href="${process.env.FRONTEND_URL}" style="display:inline-block;padding:12px 30px;background:#667eea;color:#fff;text-decoration:none;border-radius:8px;margin-top:20px;">Start Shopping</a>
      </div>
    `,
    text: `Welcome ${username}! Start shopping: ${process.env.FRONTEND_URL}`,
  });
};

const sendDeliveryOtpEmail = async (email, otp, orderId, username) => {
  return sendEmail({
    to: email,
    subject: `Delivery OTP for Order #${orderId}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:30px;text-align:center;">
        <h2>Hello ${username}!</h2>
        <p>Your delivery verification code for Order #${orderId}:</p>
        <div style="font-size:3rem;font-weight:bold;color:#667eea;letter-spacing:8px;margin:20px 0;">${otp}</div>
        <p style="color:#888;">Valid for 10 minutes. Share only with delivery person.</p>
      </div>
    `,
    text: `OTP: ${otp} for Order #${orderId}. Valid for 10 minutes.`,
  });
};

const sendOrderStatusEmail = async (email, orderId, status, username, note = "") => {
  const statusColors = {
    Pending: "#f59e0b", Confirmed: "#3b82f6", Processing: "#8b5cf6",
    Shipped: "#06b6d4", "Out Of Delivery": "#f97316", Delivered: "#10b981", Cancelled: "#ef4444"
  };
  return sendEmail({
    to: email,
    subject: `Order #${orderId} - Status: ${status}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:30px;text-align:center;">
        <h2>Hello ${username}!</h2>
        <p>Your order status has been updated:</p>
        <div style="display:inline-block;background:${statusColors[status] || "#667eea"};color:#fff;padding:10px 24px;border-radius:50px;font-weight:bold;">${status}</div>
        ${note ? `<p style="margin-top:20px;">${note}</p>` : ""}
        <a href="${process.env.FRONTEND_URL}/orders" style="display:inline-block;padding:12px 30px;background:#667eea;color:#fff;text-decoration:none;border-radius:8px;margin-top:20px;">View Order</a>
      </div>
    `,
    text: `Order #${orderId} status: ${status}. ${note ? `Note: ${note}` : ""}`,
  });
};

const testEmailConnection = async () => {
  if (!BREVO_API_KEY) return { success: false, message: "BREVO_API_KEY not configured" };
  return { success: true, message: "Brevo API key is configured" };
};

const getResetPasswordEmailTemplate = (resetUrl, userEmail = "") => {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reset Password</title>
  <style>body{margin:0;padding:0;font-family:sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;}
  .container{max-width:600px;margin:40px auto;padding:20px;}.card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,.3);}
  .header{background:linear-gradient(135deg,#667eea,#764ba2);padding:40px 30px;text-align:center;}.header h1{color:#fff;margin:0;font-size:2rem;}
  .content{padding:40px 30px;text-align:center;}.btn{display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;text-decoration:none;border-radius:50px;font-weight:bold;font-size:1.1rem;margin:20px 0;}
  .footer{background:#f9fafb;padding:30px;text-align:center;color:#6b7280;font-size:.9rem;}
  .notice{background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;margin:20px 0;text-align:left;color:#92400e;}</style></head>
  <body><div class="container"><div class="card">
  <div class="header"><h1>🔐 Reset Your Password</h1></div>
  <div class="content">
  ${userEmail ? `<p style="color:#667eea;font-weight:bold;">${userEmail}</p>` : ""}
  <p>Click the button below to reset your ShopEase password.</p>
  <a href="${resetUrl}" class="btn">Reset Password</a>
  <div class="notice">⏰ This link expires in 10 minutes.</div>
  <p style="color:#888;font-size:.85rem;">Or copy: ${resetUrl}</p>
  </div>
  <div class="footer">© ${new Date().getFullYear()} ShopEase. All rights reserved.</div>
  </div></div></body></html>`;
};

const getPasswordChangedConfirmationTemplate = (userEmail) => {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Password Changed</title>
  <style>body{margin:0;padding:0;font-family:sans-serif;background:linear-gradient(135deg,#10b981,#059669);min-height:100vh;}
  .container{max-width:600px;margin:40px auto;padding:20px;}.card{background:#fff;border-radius:20px;overflow:hidden;text-align:center;padding:40px;}
  .card h1{color:#065f46;}.btn{display:inline-block;padding:14px 35px;background:#10b981;color:#fff;text-decoration:none;border-radius:50px;font-weight:bold;margin:20px 0;}</style></head>
  <body><div class="container"><div class="card">
  <h1>✅ Password Changed Successfully!</h1>
  <p>You can now log in with your new password.</p>
  <a href="${process.env.FRONTEND_URL}/login" class="btn">Go to Login</a>
  </div></div></body></html>`;
};

module.exports = {
  sendResetPasswordEmail,
  sendPasswordChangedEmail,
  sendWelcomeEmail,
  sendDeliveryOtpEmail,
  sendOrderStatusEmail,
  testEmailConnection,
};
