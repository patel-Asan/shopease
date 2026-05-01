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
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Tahoma,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:30px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.12);">
<tr><td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center;">
<h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">🎉 Welcome, ${username}!</h1>
<p style="color:rgba(255,255,255,.85);margin:10px 0 0;font-size:16px;">You're now part of ShopEase</p>
</td></tr>
<tr><td style="padding:40px 30px;text-align:center;">
<p style="color:#374151;font-size:15px;line-height:1.8;margin:0 0 10px;">Thank you for joining our community! Start exploring amazing products and deals.</p>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-top:25px;">
<table cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:8px;">
<a href="${process.env.FRONTEND_URL}" style="display:inline-block;padding:16px 50px;color:#fff;font-size:17px;font-weight:600;text-decoration:none;letter-spacing:.5px;">Start Shopping →</a>
</td></tr></table>
</td></tr></table>
</td></tr>
<tr><td style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
<p style="color:#9ca3af;font-size:13px;margin:0;">© ${new Date().getFullYear()} ShopEase. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>`,
    text: `Welcome ${username}! Start shopping: ${process.env.FRONTEND_URL}`,
  });
};

const sendDeliveryOtpEmail = async (email, otp, orderId, username) => {
  return sendEmail({
    to: email,
    subject: `Delivery OTP for Order #${orderId}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Tahoma,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:30px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.12);">
<tr><td style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);padding:40px 30px;text-align:center;">
<h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">🔐 Delivery OTP</h1></td></tr>
<tr><td style="padding:40px 30px;text-align:center;">
<h2 style="color:#374151;margin:0 0 10px;">Hello ${username}!</h2>
<p style="color:#6b7280;margin:0 0 20px;">Order #${orderId}</p>
<div style="background:#f3f4f6;border-radius:12px;padding:30px;margin:0 auto 25px;display:inline-block;">
<p style="color:#8b8b8b;font-size:14px;margin:0 0 10px;text-transform:uppercase;letter-spacing:2px;">Your OTP</p>
<p style="font-size:3.5rem;font-weight:800;color:#667eea;letter-spacing:10px;margin:0;">${otp}</p>
</div>
<p style="color:#888;font-size:13px;margin:20px 0 0;">Valid for 10 minutes. Share only with delivery person.</p>
</td></tr>
<tr><td style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
<p style="color:#9ca3af;font-size:13px;margin:0;">© ${new Date().getFullYear()} ShopEase. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>`,
    text: `OTP: ${otp} for Order #${orderId}. Valid for 10 minutes.`,
  });
};

const sendOrderStatusEmail = async (email, orderId, status, username, note = "") => {
  const statusColors = {
    Pending: "#f59e0b", Confirmed: "#3b82f6", Processing: "#8b5cf6",
    Shipped: "#06b6d4", "Out Of Delivery": "#f97316", Delivered: "#10b981", Cancelled: "#ef4444"
  };
  const color = statusColors[status] || "#667eea";
  return sendEmail({
    to: email,
    subject: `Order #${orderId} - Status: ${status}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Tahoma,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:30px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.12);">
<tr><td style="background:linear-gradient(135deg,${color} 0%,${color}cc 100%);padding:40px 30px;text-align:center;">
<h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">📦 Order Update</h1></td></tr>
<tr><td style="padding:40px 30px;text-align:center;">
<h2 style="color:#374151;margin:0 0 10px;">Hello ${username}!</h2>
<p style="color:#6b7280;margin:0 0 20px;">Your order status has been updated</p>
<div style="background:#f3f4f6;border-radius:12px;padding:25px;margin:0 auto 25px;display:inline-block;">
<p style="color:#8b8b8b;font-size:14px;margin:0 0 10px;">Order #${orderId}</p>
<span style="display:inline-block;background:${color};color:#fff;padding:10px 30px;border-radius:50px;font-weight:700;font-size:16px;">${status}</span>
</div>
${note ? `<p style="background:#f0fdf4;border-radius:10px;padding:15px;color:#166534;margin:0 0 25px;">${note}</p>` : ""}
<table cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;">
<a href="${process.env.FRONTEND_URL}/orders" style="display:inline-block;padding:14px 40px;color:#fff;font-size:15px;font-weight:600;text-decoration:none;">View Order →</a>
</td></tr></table>
</td></tr>
<tr><td style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
<p style="color:#9ca3af;font-size:13px;margin:0;">© ${new Date().getFullYear()} ShopEase. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>`,
    text: `Order #${orderId} status: ${status}. ${note ? `Note: ${note}` : ""}`,
  });
};

const testEmailConnection = async () => {
  if (!BREVO_API_KEY) return { success: false, message: "BREVO_API_KEY not configured" };
  return { success: true, message: "Brevo API key is configured" };
};

const getResetPasswordEmailTemplate = (resetUrl, userEmail = "") => {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Password</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Tahoma,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:30px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.12);">
<tr><td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
<h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">🔐 Reset Your Password</h1>
<p style="color:rgba(255,255,255,.85);margin:10px 0 0;font-size:16px;">ShopEase</p>
</td></tr>
<tr><td style="padding:40px 30px;">
<p style="color:#6b7280;font-size:16px;text-align:center;margin:0 0 20px;">Hi there,</p>
<p style="color:#374151;font-size:15px;line-height:1.7;text-align:center;margin:0 0 10px;">We received a request to reset your password for your ShopEase account associated with <strong style="color:#667eea;">${userEmail}</strong>.</p>
<p style="color:#374151;font-size:15px;text-align:center;margin:20px 0 30px;">Click the button below to create a new password:</p>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:8px;">
<a href="${resetUrl}" style="display:inline-block;padding:16px 50px;color:#fff;font-size:17px;font-weight:600;text-decoration:none;letter-spacing:.5px;">Reset Password →</a>
</td></tr></table>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border-radius:10px;border-left:4px solid #eab308;margin-top:30px;padding:20px;"><tr><td>
<p style="color:#854d0e;font-size:14px;margin:0;font-weight:600;">⏰ Expires in 10 minutes</p>
<p style="color:#a16207;font-size:13px;margin:5px 0 0;">This link is valid for 10 minutes only. If you didn't request this, please ignore this email.</p>
</td></tr></table>
</td></tr>
<tr><td style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
<p style="color:#9ca3af;font-size:13px;margin:0;">© ${new Date().getFullYear()} ShopEase. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>`;
};

const getPasswordChangedConfirmationTemplate = (userEmail) => {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Changed</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Tahoma,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:30px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.12);">
<tr><td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center;">
<h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">✅ Password Changed!</h1>
<p style="color:rgba(255,255,255,.85);margin:10px 0 0;font-size:16px;">Your account is secure</p>
</td></tr>
<tr><td style="padding:40px 30px;text-align:center;">
<p style="color:#374151;font-size:15px;line-height:1.8;margin:0;">Your ShopEase password has been updated successfully. You can now log in with your new password.</p>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-top:25px;">
<table cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);border-radius:8px;">
<a href="${process.env.FRONTEND_URL}/login" style="display:inline-block;padding:16px 50px;color:#fff;font-size:17px;font-weight:600;text-decoration:none;letter-spacing:.5px;">Go to Login →</a>
</td></tr></table>
</td></tr></table>
<p style="color:#ef4444;font-size:13px;margin:30px 0 0;">If you didn't make this change, please contact support immediately.</p>
</td></tr>
<tr><td style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
<p style="color:#9ca3af;font-size:13px;margin:0;">© ${new Date().getFullYear()} ShopEase. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>`;
};

module.exports = {
  sendResetPasswordEmail,
  sendPasswordChangedEmail,
  sendWelcomeEmail,
  sendDeliveryOtpEmail,
  sendOrderStatusEmail,
  testEmailConnection,
};
